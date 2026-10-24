import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark dashboard-nav">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="brand-icon">✦</span>
          <span>PeopleHub</span>
        </Link>
        <div className="navbar-nav ms-auto">
          <NavLink className="nav-link" to="/">Home</NavLink>
          <NavLink className="nav-link" to="/employee-form">Employee Form</NavLink>
        </div>
      </div>
    </nav>
  );
}

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load employees.');
        return response.json();
      })
      .then(setEmployees)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="hero-card mb-4">
        <div>
          <p className="eyebrow">TEAM OVERVIEW</p>
          <h1>Employee Dashboard</h1>
          <p className="hero-text mb-0">View your team directory in one simple place.</p>
        </div>
        <Link className="btn btn-light hero-button" to="/employee-form">+ Add Employee</Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="stat-card"><span className="stat-icon">👥</span><div><small>Total employees</small><strong>{loading ? '—' : employees.length}</strong></div></div></div>
        <div className="col-md-4"><div className="stat-card"><span className="stat-icon green">✓</span><div><small>Directory status</small><strong className="status">Active</strong></div></div></div>
        <div className="col-md-4"><div className="stat-card"><span className="stat-icon orange">↗</span><div><small>Data source</small><strong>External API</strong></div></div></div>
      </div>

      <div className="section-heading"><div><h2>Team directory</h2><p>Employee information from the company API</p></div></div>
      {loading && <div className="loading-card">Loading employees...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive directory-card">
          <table className="table align-middle mb-0">
            <thead><tr><th>ID</th><th>Employee</th><th>Email address</th></tr></thead>
            <tbody>{employees.map((employee) => (
              <tr key={employee.id}>
                <td><span className="id-badge">#{employee.id}</span></td>
                <td><div className="employee-name"><span className="avatar">{employee.name.charAt(0)}</span><strong>{employee.name}</strong></div></td>
                <td className="email">{employee.email}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function EmployeeForm() {
  const [employee, setEmployee] = useState({ name: '', designation: '', location: '', salary: '' });
  const [message, setMessage] = useState('');

  function handleChange(event) {
    setEmployee({ ...employee, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage(`Employee ${employee.name} was added successfully.`);
    setEmployee({ name: '', designation: '', location: '', salary: '' });
  }

  return (
    <section className="form-container">
      <div className="page-heading"><p className="eyebrow">TEAM MANAGEMENT</p><h1>Add an employee</h1><p>Enter the details below to create a new employee record.</p></div>
      {message && <div className="alert alert-success">{message}</div>}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="mb-3"><label className="form-label" htmlFor="name">Name</label><input className="form-control" id="name" name="name" placeholder="e.g. Alex Johnson" value={employee.name} onChange={handleChange} required /></div>
        <div className="mb-3"><label className="form-label" htmlFor="designation">Designation</label><input className="form-control" id="designation" name="designation" placeholder="e.g. Product Designer" value={employee.designation} onChange={handleChange} required /></div>
        <div className="row"><div className="col-md-7 mb-3"><label className="form-label" htmlFor="location">Location</label><input className="form-control" id="location" name="location" placeholder="e.g. New York" value={employee.location} onChange={handleChange} required /></div><div className="col-md-5 mb-4"><label className="form-label" htmlFor="salary">Salary</label><input className="form-control" id="salary" name="salary" type="number" min="0" placeholder="50000" value={employee.salary} onChange={handleChange} required /></div></div>
        <button className="btn btn-primary w-100" type="submit">Save Employee</button>
      </form>
    </section>
  );
}

export default function App() {
  return <><Navbar /><main className="container py-5"><Routes><Route path="/" element={<Dashboard />} /><Route path="/employee-form" element={<EmployeeForm />} /></Routes></main></>;
}
