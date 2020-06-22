import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";

function Table() {
  const [fileText, setFileText] = useState("");
  const [tableData, setTableData] = useState([]);
  const [delimiter, setDelimiter] = useState(",");
  const [rowsCount, setRowCount] = useState(2);
  const [columnSize] = useState(4);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();

  const handleFileSelect = useCallback((files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileText(e.target.result);
    };
    reader.readAsText(file);
  }, []);

  // read the file when it changes
  useEffect(() => {
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles);
    }
  }, [acceptedFiles, handleFileSelect]);

  // get the text from file and make it compatiable for the table
  useEffect(() => {
    if (fileText) {
      setTableData(fileText.split("\n"));
    }
  }, [fileText]);

  // filter the data by delimiter and at last slice the data by given rows
  const filterTableData = (data, deli, rows) => {
    if (!delimiter) {
      return [];
    }
    const arr = [...data].filter((item) => item.includes(deli));
    const result = arr.length === 0 ? data : arr;
    return result.slice(0, rows);
  };

  // render table cell
  const _renderTableCell = (item, filterSymbol) => {
    // if a line of text include the delimiter
    if (item.includes(filterSymbol)) {
      // split the words by delimiter and generate cell for each of them
      return item
        .split(delimiter)
        .map(
          (word, index) =>
            index !== columnSize && <td className="table__cell">{word}</td>
        );
    }

    // if doesn't include then just generate one cell
    return <td className="table__cell">{item}</td>;
  };
  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input
          {...getInputProps()}
          multiple={false}
          type="file"
          name="dataFile"
          accept="text/plain"
          className="input input--file"
        />
        <p>Drag 'n' drop .text or .csv file here, or click to select file</p>
      </div>
      <div className="form-group">
        <label htmlFor="delimiter">Delimiter</label>
        <input
          type="text"
          name="delimiter"
          id="delimiter"
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          className="input input--text"
        />
      </div>
      <div className="form-group">
        <label htmlFor="rows">Rows</label>
        <input
          type="number"
          name="rows"
          id="rows"
          min={2}
          max={tableData.length}
          value={rowsCount}
          onChange={(e) => setRowCount(e.target.value)}
          className="input input--text"
        />
      </div>

      <table className="table">
        <tbody className="table__body">
          {filterTableData(tableData, delimiter, rowsCount).map((item) => (
            <tr className="table__row">{_renderTableCell(item, delimiter)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
