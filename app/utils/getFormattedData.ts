// utils/getFormattedData.ts
const getFormattedData = (data: any, format: string): string => {
    if (!data) return '';

    switch (format) {
        case 'csv': {
            try {
                // Ensure data is an array
                const dataArray = Array.isArray(data) ? data : [data];
                if (dataArray.length === 0) return '';

                // Get headers from first object
                const headers = Object.keys(dataArray[0]);
                
                // Create CSV string
                const csvRows = [
                    headers.join(','), // Header row
                    ...dataArray.map(row => 
                        headers.map(header => {
                            const cell = row[header];
                            // Handle special cases and escaping
                            if (cell === null || cell === undefined) return '';
                            if (typeof cell === 'string') {
                                // Escape quotes and wrap in quotes if contains comma
                                if (cell.includes(',') || cell.includes('"')) {
                                    return `"${cell.replace(/"/g, '""')}"`;
                                }
                                return cell;
                            }
                            return JSON.stringify(cell);
                        }).join(',')
                    )
                ];
                
                return csvRows.join('\n');
            } catch (err) {
                console.error('Error converting to CSV:', err);
                return JSON.stringify(data, null, 2);
            }
        }
        case 'sql': {
            try {
                const dataArray = Array.isArray(data) ? data : [data];
                if (dataArray.length === 0) return '';

                let tableName = 'test_data_table';
                const fields = Object.keys(dataArray[0]);
                
                // Create table
                let sqlString = `CREATE TABLE ${tableName} (\n`;
                sqlString += fields.map(field => {
                    const fieldType = inferSqlType(dataArray[0][field]);
                    return `    ${field} ${fieldType}`;
                }).join(',\n');
                sqlString += '\n);\n\n';

                // Insert data
                sqlString += dataArray.map(row => {
                    const values = fields.map(field => {
                        const value = row[field];
                        if (value === null || value === undefined) return 'NULL';
                        if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
                        return value;
                    });
                    return `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${values.join(', ')});`;
                }).join('\n');
                
                return sqlString;
            } catch (err) {
                console.error('Error converting to SQL:', err);
                return JSON.stringify(data, null, 2);
            }
        }
        default:
            return JSON.stringify(data, null, 2);
    }
};

const inferSqlType = (value: any): string => {
    switch (typeof value) {
        case 'number':
            return Number.isInteger(value) ? 'INTEGER' : 'DECIMAL(10,2)';
        case 'boolean':
            return 'BOOLEAN';
        case 'string':
            return value.length > 255 ? 'TEXT' : 'VARCHAR(255)';
        default:
            return 'TEXT';
    }
};

export default getFormattedData;