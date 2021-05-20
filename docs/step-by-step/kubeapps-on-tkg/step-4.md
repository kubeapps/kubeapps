## Step 4: Deploy and Manage Applications with Kubeapps

Once Kubeapps has been configured with one or more application repositories, it can be used to manage and deploy applications in the cluster.

The following sections discuss how to perform common tasks related to application management, including deploying an application, upgrading it, listing available applications. performing rollbacks and deleting applications.

### Deploy a New Application

To deploy a new application, follow the steps below:

1. Log in to Kubeapps to arrive at the dashboard welcome page:

   ![Kubeapps home](./img/kubeapps-applications-empty.png)

2. Use the _Catalog_ menu to search for the desired application, for instance, _MariaDB_:

   ![MariaDB chart search](./img/kubeapps-catalog-search.png)

3. Click on the application to see the details:

   ![MariaDB chart](./img/kubeapps-chart-mariadb.png)

4. Click on the _Deploy_ button. You will be prompted for the release name, cluster namespace and the values for your application deployment.

   ![MariaDB installation](./img/kubeapps-chart-mariadb-deploy.png)

5. Click the _Deploy_ button at the end of the page. Wait a while until it gets deployed.

   ![MariaDB installation wait](./img/kubeapps-chart-mariadb-wait.png)

The application is deployed. The status of the deployment can be tracked directly from the browser. The _Notes_ section of the deployment page contains important information to help you use the application.

![MariaDB deployment](./img/kubeapps-chart-mariadb-deployed.png)

### List All the Applications

The _Applications_ page displays a list of the application deployments in your cluster.

![Deployment list](./img/kubeapps-applications-one.png)

### Upgrade an Application

To upgrade an application with new values, follow the steps below:

1. Click on the application to see the details:

   ![MariaDB chart](./img/kubeapps-chart-mariadb-deployed.png)

2. Click on _Upgrade_:

   ![MariaDB chart](./img/kubeapps-chart-mariadb-deployed.png)

3. Perform the changes and click on _Changes_ to see the differences with the installed version:

   ![MariaDB installation](./img/kubeapps-chart-mariadb-upgrade.png)

4. Click on _Deploy_

The application is upgraded with the new values. As in the previous step, you can also check the new deployment status.

### Rollback an Application

To rollback an application to a previous version, follow the steps below:

1. Click on the application to see the details:

   ![MariaDB chart](./img/kubeapps-chart-mariadb-deployed.png)

2. Click on _Rollback_:

   ![MariaDB chart](./img/kubeapps-chart-mariadb-deployed.png)

3. Select the version you want to rollback to and click on _Rollback_:

   ![MariaDB installation](./img/kubeapps-chart-mariadb-rollback.png)

The application is rollback to the desired version. As in the previous step, you can also check the new deployment status.

### Delete an Application

Running applications can be removed from the cluster by clicking the _Delete_ button on the application's status page:

![Deployment removal](./img/kubeapps-chart-mariadb-delete.png)

At the end of this step, you should be able to use Kubeapps for common application management and deployment tasks. Continue reading for a collection of [useful links and references to help you maximize your usage of Kubeapps](./conclusion.md).