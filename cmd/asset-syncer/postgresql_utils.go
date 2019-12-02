/*
Copyright (c) 2018 Bitnami

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/lib/pq"
	log "github.com/sirupsen/logrus"
)

const (
	// create table charts (ID serial NOT NULL PRIMARY KEY, info json NOT NULL);
	chartTable = "charts"
	// create table repos (ID serial NOT NULL PRIMARY KEY, name varchar unique, checksum varchar, last_update varchar);
	repositoryTable = "repos"
	chartFilesTable = "files"
)

type postgresDB interface {
	Query(query string, args ...interface{}) (*sql.Rows, error)
	Begin() (*sql.Tx, error)
	QueryRow(query string, args ...interface{}) *sql.Row
}

type postgresAssetManager struct {
	db postgresDB
}

// Syncing is performed in the following steps:
// 1. Update database to match chart metadata from index
// 2. Concurrently process icons for charts (concurrently)
// 3. Concurrently process the README and values.yaml for the latest chart version of each chart
// 4. Concurrently process READMEs and values.yaml for historic chart versions
//
// These steps are processed in this way to ensure relevant chart data is
// imported into the database as fast as possible. E.g. we want all icons for
// charts before fetching readmes for each chart and version pair.
func (m *postgresAssetManager) Sync(repoName, repoURL string, authorizationHeader string) error {
	url, err := parseRepoURL(repoURL)
	if err != nil {
		log.WithFields(log.Fields{"url": repoURL}).WithError(err).Error("failed to parse URL")
		return err
	}

	r := repo{Name: repoName, URL: url.String(), AuthorizationHeader: authorizationHeader}
	repoBytes, err := fetchRepoIndex(r)
	if err != nil {
		return err
	}

	repoChecksum, err := getSha256(repoBytes)
	if err != nil {
		return err
	}

	// Check if the repo has been already processed
	if m.repoAlreadyProcessed(repoName, repoChecksum) {
		log.WithFields(log.Fields{"url": repoURL}).Info("Skipping repository since there are no updates")
		return nil
	}

	index, err := parseRepoIndex(repoBytes)
	if err != nil {
		return err
	}

	charts := chartsFromIndex(index, r)
	if len(charts) == 0 {
		return errors.New("no charts in repository index")
	}
	err = m.importCharts(charts)
	if err != nil {
		return err
	}

	// TODO(andresmgot): Fetch and store chart icons

	// Update cache in the database
	if err = m.updateLastCheck(repoName, repoChecksum, time.Now()); err != nil {
		return err
	}
	log.WithFields(log.Fields{"url": repoURL}).Info("Stored repository update in cache")

	return nil
}

func (m *postgresAssetManager) repoAlreadyProcessed(repoName, repoChecksum string) bool {
	var lastChecksum string
	row := m.db.QueryRow(fmt.Sprintf("SELECT checksum FROM %s WHERE name = '%s'", repositoryTable, repoName))
	err := row.Scan(&lastChecksum)
	return err == nil && lastChecksum == repoChecksum
}

func (m *postgresAssetManager) updateLastCheck(repoName, checksum string, now time.Time) error {
	query := fmt.Sprintf(`INSERT INTO %s (name, checksum, last_update)
	VALUES ('%s', '%s', '%s')
	ON CONFLICT (name) 
	DO UPDATE SET last_update = '%s', checksum = '%s'
	`, repositoryTable, repoName, checksum, now.String(), now.String(), checksum)
	_, err := m.db.Query(query)
	return err
}

func (m *postgresAssetManager) importCharts(charts []chart) error {
	var chartIDs []string
	txn, err := m.db.Begin()
	if err != nil {
		log.Fatal(err)
	}

	stmt, err := txn.Prepare(pq.CopyIn(chartTable, "info"))
	if err != nil {
		return err
	}

	for _, chart := range charts {
		chartIDs = append(chartIDs, fmt.Sprintf("'%s'", chart.ID))
		d, err := json.Marshal(chart)
		if err != nil {
			return err
		}
		_, err = stmt.Exec(string(d))
		if err != nil {
			return err
		}
	}

	_, err = stmt.Exec()
	if err != nil {
		return err
	}

	err = stmt.Close()
	if err != nil {
		return err
	}

	err = txn.Commit()
	if err != nil {
		return err
	}

	// Remove charts no longer existing in index
	chartIDsString := strings.Join(chartIDs, ", ")
	_, err = m.db.Query(fmt.Sprintf("DELETE FROM %s WHERE info ->> 'ID' NOT IN (%s)", chartTable, chartIDsString))
	return err
}

func (m *postgresAssetManager) Delete(repoName string) error {
	tables := []string{chartTable, repositoryTable, chartFilesTable}
	for _, table := range tables {
		_, err := m.db.Query(fmt.Sprintf("DELETE FROM %s WHERE info -> 'repo' ->> 'name' = '%s'", table, repoName))
		if err != nil {
			return err
		}
	}
	return nil
}
