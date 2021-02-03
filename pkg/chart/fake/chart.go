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

package fake

import (
	appRepov1 "github.com/kubeapps/kubeapps/cmd/apprepository-controller/pkg/apis/apprepository/v1alpha1"
	chartUtils "github.com/kubeapps/kubeapps/pkg/chart"
	"github.com/kubeapps/kubeapps/pkg/kube"
	chart3 "helm.sh/helm/v3/pkg/chart"
	"sigs.k8s.io/yaml"
)

// Chart implements Resolver inteface
type Chart struct{}

// GetChart fake
func (f *Chart) GetChart(details *chartUtils.Details, repoURL string) (*chart3.Chart, error) {
	vals, err := getValues([]byte(details.Values))
	if err != nil {
		return nil, err
	}
	return &chart3.Chart{
		Metadata: &chart3.Metadata{
			Name: details.ChartName,
		},
		Values: vals,
	}, nil
}

func getValues(raw []byte) (map[string]interface{}, error) {
	values := make(map[string]interface{})
	err := yaml.Unmarshal(raw, &values)
	if err != nil {
		return nil, err
	}
	return values, nil
}

// InitClient fake
func (f *Chart) InitClient(appRepo *appRepov1.AppRepository, client kube.AuthedHandler) error {
	return nil
}
