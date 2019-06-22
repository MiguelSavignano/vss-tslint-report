export const getValue = (
  variables: Array<{ name: string; value: string }>,
  name: string
) => variables.find(it => it.name == name).value;

export const getOrganizationName = string => string.split("/")[3];

export const getArtifactUrl = variables => {
  const organizationName = getOrganizationName(
    getValue(variables, "system.teamFoundationCollectionUri")
  );
  const containerId = getValue(variables, "build.containerId");
  return `https://${organizationName}.visualstudio.com/_apis/resources/Containers/${containerId}?itemPath=tslint%2Ftslint-report.html`;
};
