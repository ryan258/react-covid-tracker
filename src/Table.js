import React from 'react'
import './Table.css'

function Table({ countries }) {
  return (
    <table className="table">
      <tbody>
      {countries.map(({country, cases}) => (
        <tr key={country}>
          <td>{country}</td>
          <td><strong>{cases}</strong></td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

export default Table
