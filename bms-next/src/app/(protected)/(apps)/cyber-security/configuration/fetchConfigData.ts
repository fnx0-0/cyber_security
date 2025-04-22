import * as api from "../misc/utils/api";

export default async function fetchConfigurationData(
  tableName: string,
  provider: string
) {
  const configData = await api.fetchData(
    tableName,
    provider,
  );

  return configData;
}
