//create table
export async function createTable(
  tableName: string,
  columns: Record<string, string>[]
) {
  const columnDefinitions = columns
    .map(
      ({ column, dataType, constraints, defaultValue }) =>
        `${column} ${dataType} ${constraints ?? ""} ${
          defaultValue ? `DEFAULT ${defaultValue}` : ""
        }`
    )
    .join(", ");

  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});`;
  console.log("query - " + query);

  const res = await fetch("/api/dbApi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

// describe table
export async function descTable(tableName: string) {
  const query = `SELECT json_agg(row_to_json(columns_info)) 
                            FROM (
                            SELECT column_name, data_type, is_nullable, column_default
                            FROM information_schema.columns 
                            WHERE table_name = '${tableName}'
                            ) AS columns_info;
                            `;
  const res = await fetch("/api/dbApi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

// show tables
export async function showTables() {
  const query = `SELECT json_agg(row_to_json(tables_info)) 
                    FROM (
                    SELECT table_name
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    ) AS tables_info;`;
  const res = await fetch("/api/dbApi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

//update table with values
export async function addColumn(
  tableName: string,
  values: Record<string, any>[]
) {
  if (!values.length) {
    throw new Error("Values array cannot be empty");
  }

  const validColumns = values.filter(({ value }) => value !== undefined);

  if (!validColumns.length) {
    throw new Error("No valid columns provided");
  }

  const columns = validColumns.map(({ column }) => column);


  const valuesArr = validColumns.map(({ value }) => value || []);

  const rowCount = Math.max(...valuesArr.map((arr) => arr.length), 0);

  let valuesString = "";
  for (let i = 0; i < rowCount; i++) {
    const rowValues = validColumns.map(({ value, jsonb }) => {
      let val = value?.[i];

      if (val === "DEFAULT") return "DEFAULT";
      if (val === null) return "NULL";

      if (jsonb) {
        return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
      } else if (typeof val === "string") {
        return `'${val.replace(/'/g, "''")}'`;
      } else {
        return val;
      }
    });

    valuesString += `(${rowValues.join(", ")}),`;
  }

  valuesString = valuesString.slice(0, -1);

  const query = `INSERT INTO "${tableName}" (${columns.join(
    ", "
  )}) VALUES ${valuesString};`;

  console.log(query);

  const res = await fetch("/api/dbApi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}



//delete table
export async function deleteTable(tableName: string) {
  const query = `DROP TABLE IF EXISTS ${tableName};`;
  const res = await fetch("/api/dbApi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

//Read Table
export async function getTableValues(tableName: string) {
  const query = `SELECT json_agg(t) 
                    FROM ${tableName} t;`;

  const custonQuery = `SELECT json_agg(json_build_object('id', id,'name', name,'email', email)) FROM ${tableName} WHERE name = 'Alice';`;

  const res = await fetch("/api/dbApi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}



export async function insertValueIntoIndex(tableName : string, index : number){

  
}
