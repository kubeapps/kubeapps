const utils = require("./lib/utils");

// The operator may take some minutes to be created
jest.setTimeout(360000);

test("Deploys an Operator", async () => {
  await utils.login(
    page,
    process.env.USE_MULTICLUSTER_OIDC_ENV,
    "/#/c/default/ns/kubeapps/operators",
    process.env.ADMIN_TOKEN,
    "kubeapps-operator@example.com",
    "password",
  );

  // Browse operator
  await expect(page).toMatchElement("a", { text: "prometheus", timeout: 60000 });
  await expect(page).toClick("a", { text: "prometheus" });

  await utils.retryAndRefresh(page, 3, async () => {
    // Sometimes this fails with: TypeError: Cannot read property 'click' of null
    await expect(page).toClick("cds-button", { text: "Deploy" });
  });

  const isAlreadyDeployed = await page.evaluate(
    () => document.querySelector("cds-button[disabled]") !== null,
  );

  if (!isAlreadyDeployed) {
    // Deploy the Operator
    await expect(page).toClick("cds-button", { text: "Deploy" });

    await utils.retryAndRefresh(page, 4, async () => {
      // The CSV takes a bit to get populated
      await expect(page).toMatch("Installed");
    });
  } else {
    console.log("Warning: the operator has already been deployed");
  }

  // Wait for the operator to be ready to be used
  await expect(page).toClick("a", { text: "Catalog" });

  await utils.retryAndRefresh(page, 30, async () => {
    await expect(page).toMatch("Operators");

    // Filter out charts to search only for the prometheus operator
    await expect(page).toMatchElement("label", { text: "Operators", timeout: 60000 });
    await expect(page).toClick("label", { text: "Operators" });


    await expect(page).toMatch("Prometheus");

    await expect(page).toClick(".info-card-header", { text: "Prometheus" });
  });

  await utils.retryAndRefresh(page, 2, async () => {
    // Found the error "prometheuses.monitoring.coreos.com not found in the definition of prometheusoperator"
    await expect(page).toMatch("Deploy");
  });

  await utils.retryAndRefresh(page, 5, async () => {
    await expect(page).toClick("cds-button", { text: "Deploy" });

    await expect(page).toMatch("Installation Values");
  },
    "operator-view",
  );

  // Update
  await expect(page).toClick("cds-button", { text: "Update" });

  await utils.retryAndRefresh(page, 2, async () => {
    await expect(page).toMatch("creationTimestamp");
  });

  await expect(page).toClick("cds-button", { text: "Deploy" });

  await utils.retryAndRefresh(page, 2, async () => {
    await expect(page).toMatch("Installation Values");
  });

  // Delete
  await expect(page).toClick("cds-button", { text: "Delete" });

  await expect(page).toMatch("Are you sure you want to delete the resource?");

  await expect(page).toClick(
    "div.modal-dialog.modal-md > div > div.modal-body > div > div > cds-button:nth-child(2)",
    {
      text: "Delete",
    },
  );

  // Goes back to application list
  await expect(page).toMatch("Applications", { timeout: 60000 });
});
