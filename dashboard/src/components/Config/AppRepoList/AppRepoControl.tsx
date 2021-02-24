import React, { useState } from "react";

import { CdsButton } from "@cds/react/button";
import { useDispatch } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { IAppRepository, ISecret, IStoreState } from "shared/types";
import actions from "../../../actions";
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog";
import { AppRepoAddButton } from "./AppRepoButton";
import "./AppRepoControl.css";

interface IAppRepoListItemProps {
  repo: IAppRepository;
  kubeappsNamespace: string;
  secret?: ISecret;
  refetchRepos: () => void;
}

export function AppRepoControl({
  repo,
  secret,
  kubeappsNamespace,
  refetchRepos,
}: IAppRepoListItemProps) {
  const [modalIsOpen, setModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const dispatch: ThunkDispatch<IStoreState, null, Action> = useDispatch();

  const handleDeleteClick = (repoName: string, repoNamespace: string) => {
    return async () => {
      await dispatch(actions.repos.deleteRepo(repoName, repoNamespace));
      refetchRepos();
      closeModal();
    };
  };

  const handleResyncClick = (repoName: string, repoNamespace: string) => {
    return () => {
      setRefreshing(true);
      dispatch(actions.repos.resyncRepo(repoName, repoNamespace));
      // Fake timeout to show progress
      // TODO(andresmgot): Ideally, we should show the progress of the sync but we don't
      // have that info yet: https://github.com/kubeapps/kubeapps/issues/153
      setTimeout(() => setRefreshing(false), 500);
    };
  };

  return (
    <div className="apprepo-control-buttons">
      <ConfirmDialog
        onConfirm={handleDeleteClick(repo.metadata.name, repo.metadata.namespace)}
        modalIsOpen={modalIsOpen}
        loading={false}
        closeModal={closeModal}
        confirmationText={`Are you sure you want to delete the repository ${repo.metadata.name}?`}
      />

      <AppRepoAddButton
        namespace={repo.metadata.namespace}
        kubeappsNamespace={kubeappsNamespace}
        text="Edit"
        repo={repo}
        secret={secret}
        primary={false}
      />

      <CdsButton
        onClick={handleResyncClick(repo.metadata.name, repo.metadata.namespace)}
        action="outline"
        disabled={refreshing}
      >
        {refreshing ? "Refreshing" : "Refresh"}
      </CdsButton>
      <CdsButton status="danger" onClick={openModal} action="outline">
        Delete
      </CdsButton>
    </div>
  );
}
