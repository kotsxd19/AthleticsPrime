// src/pages/Employees.jsx
import React from 'react';
import useEmployees from '../hooks/useEmployees';
import PageHeader from '../components/shared/PageHeader';
import Toast from '../components/shared/Toast';
import EmployeesStats from '../components/employees/EmployeesStats';
import EmployeesFilters from '../components/employees/EmployeesFilters';
import EmployeesTable from '../components/employees/EmployeesTable';
import EmployeeModal from '../components/employees/EmployeeModal';

export default function Employees() {
  const {
    filtered,
    stats,
    filter,
    setFilter,
    search,
    setSearch,
    loading,
    error,
    modalOpen,
    id,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    status,
    setStatus,
    phone_number,
    setPhoneNumber,
    position,
    setPosition,
    hire_date,
    setHireDate,
    is_verified,
    setIsVerified,
    address,
    setAddress,
    toast,
    openCreate,
    openEdit,
    closeModal,
    saveEmployee,
    toggleEmployee,
    toggleVerified,
    deleteEmployee,
    submitting,
  } = useEmployees();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Empleados"
          subtitle="Gestiona el personal interno, cargos y estados de activación"
        />
        <EmployeesStats stats={stats} />
      </div>

      <EmployeesFilters
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      <EmployeesTable
        employees={filtered}
        loading={loading}
        error={error}
        onEdit={openEdit}
        onDelete={deleteEmployee}
        onToggle={toggleEmployee}
        onToggleVerified={toggleVerified}
      />

      {/* FAB to add new employee */}
      <button
        onClick={openCreate}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30 cursor-pointer"
        aria-label="Agregar empleado"
      >
        <i className="fa-solid fa-plus" />
      </button>

      {/* Form Modal */}
      {modalOpen && (
        <EmployeeModal
          id={id}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          phone_number={phone_number}
          setPhoneNumber={setPhoneNumber}
          position={position}
          setPosition={setPosition}
          hire_date={hire_date}
          setHireDate={setHireDate}
          address={address}
          setAddress={setAddress}
          status={status}
          setStatus={setStatus}
          is_verified={is_verified}
          setIsVerified={setIsVerified}
          onSubmit={saveEmployee}
          onClose={closeModal}
          submitting={submitting}
          error={error}
        />
      )}

      <Toast message={toast} />

    </main>
  );
}
