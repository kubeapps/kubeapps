import { CdsButton } from "@cds/react/button";
import { CdsCheckbox } from "@cds/react/checkbox";
import { CdsControlMessage } from "@cds/react/forms";
import { CdsFormGroup } from "@cds/react/forms";
import { CdsInput } from "@cds/react/input";
import { CdsRadio, CdsRadioGroup } from "@cds/react/radio";
import { CdsTextarea } from "@cds/react/textarea";
import actions from "actions";
import Alert from "components/js/Alert";
import * as yaml from "js-yaml";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { IAppRepository, ISecret, IStoreState } from "../../../shared/types";
import AppRepoAddDockerCreds from "./AppRepoAddDockerCreds";
import "./AppRepoForm.css";

interface IAppRepoFormProps {
  onSubmit: (
    name: string,
    url: string,
    type: string,
    authHeader: string,
    customCA: string,
    syncJobPodTemplate: string,
    registrySecrets: string[],
    ociRepositories: string[],
    skipTLS: boolean,
  ) => Promise<boolean>;
  onAfterInstall?: () => void;
  namespace: string;
  kubeappsNamespace: string;
  repo?: IAppRepository;
  secret?: ISecret;
}

const AUTH_METHOD_NONE = "none";
const AUTH_METHOD_BASIC = "basic";
const AUTH_METHOD_BEARER = "bearer";
const AUTH_METHOD_CUSTOM = "custom";

const TYPE_HELM = "helm";
const TYPE_OCI = "oci";

export function AppRepoForm(props: IAppRepoFormProps) {
  const { onSubmit, onAfterInstall, namespace, kubeappsNamespace, repo, secret } = props;
  const dispatch: ThunkDispatch<IStoreState, null, Action> = useDispatch();

  const [authMethod, setAuthMethod] = useState(AUTH_METHOD_NONE);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [authHeader, setAuthHeader] = useState("");
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [url, setURL] = useState("");
  const [customCA, setCustomCA] = useState("");
  const [syncJobPodTemplate, setSyncJobTemplate] = useState("");
  const [type, setType] = useState(TYPE_HELM);
  const [ociRepositories, setOCIRepositories] = useState("");
  const [skipTLS, setSkipTLS] = useState(!!repo?.spec?.tlsInsecureSkipVerify);

  const [selectedImagePullSecrets, setSelectedImagePullSecrets] = useState(
    {} as { [key: string]: boolean },
  );
  const [validated, setValidated] = useState(undefined as undefined | boolean);

  const {
    repos: {
      imagePullSecrets,
      errors: { create: createError, update: updateError, validate: validationError },
      validating,
    },
    config: { appVersion },
  } = useSelector((state: IStoreState) => state);

  useEffect(() => {
    // Select the pull secrets if they are already selected in the existing repo
    imagePullSecrets.forEach(pullSecret => {
      const secretName = pullSecret.metadata.name;
      if (
        repo?.spec?.dockerRegistrySecrets?.some(s => s === secretName) &&
        !selectedImagePullSecrets[secretName]
      ) {
        setSelectedImagePullSecrets({
          ...selectedImagePullSecrets,
          [pullSecret.metadata.name]: true,
        });
      }
    });
  }, [imagePullSecrets, repo, selectedImagePullSecrets]);

  useEffect(() => {
    if (repo) {
      setName(repo.metadata.name);
      setURL(repo.spec?.url || "");
      setType(repo.spec?.type || "");
      setSyncJobTemplate(
        repo.spec?.syncJobPodTemplate ? yaml.dump(repo.spec?.syncJobPodTemplate) : "",
      );
      setOCIRepositories(repo.spec?.ociRepositories?.join(", ") || "");
      setSkipTLS(!!repo.spec?.tlsInsecureSkipVerify);
      if (secret) {
        if (secret.data["ca.crt"]) {
          setCustomCA(atob(secret.data["ca.crt"]));
        }
        if (secret.data.authorizationHeader) {
          if (authHeader.startsWith("Basic")) {
            const userPass = atob(authHeader.split(" ")[1]).split(":");
            setUser(userPass[0]);
            setPassword(userPass[1]);
            setAuthMethod(AUTH_METHOD_BASIC);
          } else if (authHeader.startsWith("Bearer")) {
            setToken(authHeader.split(" ")[1]);
            setAuthMethod(AUTH_METHOD_BEARER);
          } else {
            setAuthMethod(AUTH_METHOD_CUSTOM);
            setAuthHeader(atob(secret.data.authorizationHeader));
          }
        }
      }
    }
  }, [repo, secret, authHeader]);

  const handleInstallClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    install();
  };

  const install = async () => {
    let finalHeader = "";
    switch (authMethod) {
      case AUTH_METHOD_CUSTOM:
        finalHeader = authHeader;
        break;
      case AUTH_METHOD_BASIC:
        finalHeader = `Basic ${btoa(`${user}:${password}`)}`;
        break;
      case AUTH_METHOD_BEARER:
        finalHeader = `Bearer ${token}`;
        break;
    }
    const ociRepoList = ociRepositories.length ? ociRepositories.split(",").map(r => r.trim()) : [];
    // If the scheme is not specified, assume HTTPS. This is common for OCI registries
    const finalURL = url.startsWith("http") ? url : `https://${url}`;
    // If the validation already failed and we try to reinstall,
    // skip validation and force install
    const force = validated === false;
    let currentlyValidated = validated;
    if (!validated && !force) {
      currentlyValidated = await dispatch(
        actions.repos.validateRepo(finalURL, type, finalHeader, customCA, ociRepoList, skipTLS),
      );
      setValidated(currentlyValidated);
    }
    if (currentlyValidated || force) {
      const imagePullSecretsNames = Object.keys(selectedImagePullSecrets).filter(
        s => selectedImagePullSecrets[s],
      );
      const success = await onSubmit(
        name,
        finalURL,
        type,
        finalHeader,
        customCA,
        syncJobPodTemplate,
        imagePullSecretsNames,
        ociRepoList,
        skipTLS,
      );
      if (success && onAfterInstall) {
        onAfterInstall();
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURL(e.target.value);
    setValidated(undefined);
  };
  const handleAuthHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthHeader(e.target.value);
    setValidated(undefined);
  };
  const handleAuthTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    setValidated(undefined);
  };
  const handleCustomCAChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomCA(e.target.value);
    setValidated(undefined);
  };
  const handleAuthRadioButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthMethod(e.target.value);
    setValidated(undefined);
  };
  const handleTypeRadioButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
    setValidated(undefined);
  };
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
    setValidated(undefined);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setValidated(undefined);
  };
  const handleSyncJobPodTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSyncJobTemplate(e.target.value);
    setValidated(undefined);
  };
  const handleOCIRepositoriesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOCIRepositories(e.target.value);
    setValidated(undefined);
  };
  const handleSkipTLSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkipTLS(!skipTLS);
    setValidated(undefined);
  };

  const togglePullSecret = (imagePullSecret: string) => {
    return () => {
      setSelectedImagePullSecrets({
        ...selectedImagePullSecrets,
        [imagePullSecret]: !selectedImagePullSecrets[imagePullSecret],
      });
    };
  };

  const parseValidationError = (error: Error) => {
    let message = error.message;
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.code && parsedMessage.message) {
        message = `Code: ${parsedMessage.code}. Message: ${parsedMessage.message}`;
      }
    } catch (e) {
      // Not a json message
    }
    return message;
  };

  return (
    <form onSubmit={handleInstallClick}>
      <CdsFormGroup layout="vertical">
        <CdsInput>
          <label>Name</label>
          <input
            id="kubeapps-repo-name"
            type="text"
            placeholder="example"
            value={name}
            onChange={handleNameChange}
            required={true}
            pattern="[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*"
            title="Use lower case alphanumeric characters, '-' or '.'"
            disabled={repo?.metadata.name ? true : false}
          />
        </CdsInput>
        <CdsInput>
          <label> URL </label>
          <input
            id="kubeapps-repo-url"
            type="url"
            placeholder="https://charts.example.com/stable"
            value={url}
            onChange={handleURLChange}
            required={true}
          />
        </CdsInput>

        <div cds-layout="grid gap:lg">
          <CdsRadioGroup cds-layout="col@xs:4">
            <label>Repository Authorization</label>
            <CdsRadio>
              <label>None (Public)</label>
              <input
                id="kubeapps-repo-auth-method-none"
                type="radio"
                name="auth"
                value={AUTH_METHOD_NONE}
                checked={authMethod === AUTH_METHOD_NONE}
                onChange={handleAuthRadioButtonChange}
              />
            </CdsRadio>
            <CdsRadio>
              <label>Basic Auth</label>
              <input
                id="kubeapps-repo-auth-method-basic"
                type="radio"
                name="auth"
                checked={authMethod === AUTH_METHOD_BASIC}
                value={AUTH_METHOD_BASIC}
                onChange={handleAuthRadioButtonChange}
              />
            </CdsRadio>
            <CdsRadio>
              <label>Bearer Token</label>
              <input
                id="kubeapps-repo-auth-method-bearer"
                type="radio"
                name="auth"
                value={AUTH_METHOD_BEARER}
                checked={authMethod === AUTH_METHOD_BEARER}
                onChange={handleAuthRadioButtonChange}
              />
            </CdsRadio>
            <CdsRadio>
              <label>Custom</label>
              <input
                id="kubeapps-repo-auth-method-custom"
                type="radio"
                name="auth"
                value={AUTH_METHOD_CUSTOM}
                checked={authMethod === AUTH_METHOD_CUSTOM}
                onChange={handleAuthRadioButtonChange}
              />
            </CdsRadio>
          </CdsRadioGroup>
          <div cds-layout="col@xs:8">
            <div hidden={authMethod !== AUTH_METHOD_BASIC}>
              <CdsInput>
                <label>Username</label>
                <input
                  id="kubeapps-repo-username"
                  type="text"
                  value={user}
                  onChange={handleUserChange}
                  placeholder="Username"
                />
              </CdsInput>
              <br />
              <CdsInput>
                <label>Password</label>
                <input
                  id="kubeapps-repo-password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                />
              </CdsInput>
            </div>
            <div hidden={authMethod !== AUTH_METHOD_BEARER}>
              <CdsInput>
                <label>Token</label>
                <input
                  type="text"
                  value={token}
                  onChange={handleAuthTokenChange}
                  id="kubeapps-repo-token"
                />
              </CdsInput>
            </div>
            <div hidden={authMethod !== AUTH_METHOD_CUSTOM}>
              <CdsInput>
                <label>Complete Authorization Header</label>
                <input
                  id="kubeapps-repo-custom-header"
                  type="text"
                  placeholder="Bearer xrxNcWghpRLdcPHFgVRM73rr4N7qjvjm"
                  value={authHeader}
                  onChange={handleAuthHeaderChange}
                />
              </CdsInput>
            </div>
          </div>
        </div>

        <div cds-layout="grid gap:lg">
          <CdsRadioGroup cds-layout="col@xs:4" layout="vertical">
            <label>Repository Type</label>
            <CdsControlMessage>Select the chart storage type.</CdsControlMessage>
            <CdsRadio>
              <label>Helm Repository</label>
              <input
                id="kubeapps-repo-type-helm"
                type="radio"
                name="type"
                value={TYPE_HELM}
                checked={type === TYPE_HELM}
                onChange={handleTypeRadioButtonChange}
              />
            </CdsRadio>
            <CdsRadio>
              <label>OCI Registry</label>
              <input
                id="kubeapps-repo-type-oci"
                type="radio"
                name="type"
                value={TYPE_OCI}
                checked={type === TYPE_OCI}
                onChange={handleTypeRadioButtonChange}
              />
            </CdsRadio>
          </CdsRadioGroup>
          {type === TYPE_OCI && (
            <CdsTextarea cds-layout="col@xs:8">
              <label htmlFor="kubeapps-oci-repositories">List of Repositories</label>
              <CdsControlMessage>
                Include a list of comma-separated repositories that will be available in Kubeapps.
              </CdsControlMessage>
              <textarea
                id="kubeapps-oci-repositories"
                className="cds-textarea-fix"
                placeholder={"nginx, jenkins"}
                value={ociRepositories}
                onChange={handleOCIRepositoriesChange}
              />
            </CdsTextarea>
          )}
        </div>

        {
          /* Only when using a namespace different than the Kubeapps namespace (Global)
              the repository can be associated with Docker Registry Credentials since
              the pull secret won't be available in all namespaces */
          namespace !== kubeappsNamespace && (
            <AppRepoAddDockerCreds
              imagePullSecrets={imagePullSecrets}
              togglePullSecret={togglePullSecret}
              selectedImagePullSecrets={selectedImagePullSecrets}
              namespace={namespace}
              appVersion={appVersion}
            />
          )
        }

        <CdsTextarea layout="vertical">
          <label>Custom CA Certificate (optional)</label>
          <textarea
            id="kubeapps-repo-custom-ca"
            placeholder={"-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"}
            className="cds-textarea-fix"
            value={customCA}
            disabled={skipTLS}
            onChange={handleCustomCAChange}
          />
        </CdsTextarea>
        <CdsCheckbox className="ca-skip-tls">
          <label className="clr-control-label">Skip TLS Verification</label>
          <input
            id="kubeapps-repo-skip-tls"
            type="checkbox"
            checked={skipTLS}
            onChange={handleSkipTLSChange}
          />
        </CdsCheckbox>

        <CdsTextarea layout="vertical">
          <label>Custom Sync Job Template (optional)</label>
          <CdsControlMessage>
            It's possible to modify the default sync job. When doing this, the pre-validation is not
            supported. More info{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://github.com/kubeapps/kubeapps/blob/${appVersion}/docs/user/private-app-repository.md#modifying-the-synchronization-job`}
            >
              here
            </a>
            .
          </CdsControlMessage>
          <textarea
            id="kubeapps-repo-sync-job-tpl"
            rows={5}
            className="cds-textarea-fix"
            placeholder={
              "spec:\n" +
              "  containers:\n" +
              "  - env:\n" +
              "    - name: FOO\n" +
              "      value: BAR\n"
            }
            value={syncJobPodTemplate}
            onChange={handleSyncJobPodTemplateChange}
          />
        </CdsTextarea>
      </CdsFormGroup>

      {namespace === kubeappsNamespace && (
        <p>
          <strong>NOTE:</strong> This App Repository will be created in the "{kubeappsNamespace}"
          namespace and charts will be available in all namespaces for installation.
        </p>
      )}
      {validationError && (
        <Alert theme="danger">
          Validation Failed. Got: {parseValidationError(validationError)}
        </Alert>
      )}
      {createError && (
        <Alert theme="danger">
          An error occurred while creating the repository: {createError.message}
        </Alert>
      )}
      {updateError && (
        <Alert theme="danger">
          An error occurred while updating the repository: {updateError.message}
        </Alert>
      )}
      <div className="clr-form-separator">
        <CdsButton disabled={validating} onClick={install}>
          {validating
            ? "Validating..."
            : `${repo ? "Update" : "Install"} Repo ${validated === false ? "(force)" : ""}`}
        </CdsButton>
      </div>
    </form>
  );
}
