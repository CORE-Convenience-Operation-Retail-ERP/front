import React, { useState } from 'react';
import EmployeesListCom from '../../components/headquarters/EmployeesListCom';

const EmployeesListCon = () => {
  // 하드코딩 mock 데이터
  const [departments] = useState([
    { deptId: 1, deptName: '인사팀' },
    { deptId: 2, deptName: '영업팀' },
    { deptId: 3, deptName: '개발팀' }
  ]);
  const [employees] = useState([
    { empId: 1, empName: '홍길동', deptName: '인사팀', empRole: '사원', empStatus: '재직', hireDate: '2022-01-01' },
    { empId: 2, empName: '김철수', deptName: '영업팀', empRole: '대리', empStatus: '휴직', hireDate: '2021-03-15' },
    { empId: 3, empName: '이영희', deptName: '개발팀', empRole: '과장', empStatus: '퇴사', hireDate: '2020-07-10' },
    { empId: 4, empName: '박민수', deptName: '인사팀', empRole: '차장', empStatus: '재직', hireDate: '2019-11-20' },
    { empId: 5, empName: '최수정', deptName: '영업팀', empRole: '사원', empStatus: '재직', hireDate: '2022-05-02' },
    { empId: 6, empName: '정유진', deptName: '개발팀', empRole: '대리', empStatus: '재직', hireDate: '2021-08-17' },
    { empId: 7, empName: '한지훈', deptName: '인사팀', empRole: '과장', empStatus: '휴직', hireDate: '2020-12-01' },
    { empId: 8, empName: '오세훈', deptName: '영업팀', empRole: '차장', empStatus: '재직', hireDate: '2018-04-10' },
    { empId: 9, empName: '이소라', deptName: '개발팀', empRole: '사원', empStatus: '재직', hireDate: '2023-01-11' },
    { empId: 10, empName: '김지현', deptName: '인사팀', empRole: '대리', empStatus: '퇴사', hireDate: '2017-09-23' },
    { empId: 11, empName: '박지훈', deptName: '영업팀', empRole: '과장', empStatus: '재직', hireDate: '2016-06-30' },
    { empId: 12, empName: '최민아', deptName: '개발팀', empRole: '차장', empStatus: '휴직', hireDate: '2019-02-14' },
    { empId: 13, empName: '정성훈', deptName: '인사팀', empRole: '사원', empStatus: '재직', hireDate: '2022-10-05' },
    { empId: 14, empName: '한예진', deptName: '영업팀', empRole: '대리', empStatus: '재직', hireDate: '2021-12-19' },
    { empId: 15, empName: '오지훈', deptName: '개발팀', empRole: '과장', empStatus: '재직', hireDate: '2020-03-08' },
    { empId: 16, empName: '이하늘', deptName: '인사팀', empRole: '차장', empStatus: '휴직', hireDate: '2018-07-21' },
    { empId: 17, empName: '김태희', deptName: '영업팀', empRole: '사원', empStatus: '재직', hireDate: '2023-02-15' },
    { empId: 18, empName: '박서준', deptName: '개발팀', empRole: '대리', empStatus: '재직', hireDate: '2021-11-03' },
    { empId: 19, empName: '최지우', deptName: '인사팀', empRole: '과장', empStatus: '재직', hireDate: '2020-05-27' },
    { empId: 20, empName: '정해인', deptName: '영업팀', empRole: '차장', empStatus: '퇴사', hireDate: '2017-03-12' },
    { empId: 21, empName: '이민정', deptName: '개발팀', empRole: '사원', empStatus: '재직', hireDate: '2022-09-09' },
    { empId: 22, empName: '김우빈', deptName: '인사팀', empRole: '대리', empStatus: '재직', hireDate: '2021-04-18' },
    { empId: 23, empName: '박보검', deptName: '영업팀', empRole: '과장', empStatus: '휴직', hireDate: '2019-08-29' },
  ]);
  
  const [search, setSearch] = useState({ deptName: '', empName: '', empId: '' });
  const [filters, setFilters] = useState({ sort: 'empId', order: 'asc' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 페이징 상태
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // 검색/필터링된 데이터 (여기선 전체 employees 사용)
  const filtered = employees; // 필요시 검색/필터 적용

  // 현재 페이지 데이터
  const pagedEmployees = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // 상세보기 mock
  const handleDetail = (empId) => {
    const emp = employees.find(e => e.empId === empId);
    setSelectedEmployee(emp);
    setModalOpen(true);
  };

  return (
    <EmployeesListCom
      departments={departments}
      employees={pagedEmployees}
      search={search}
      setSearch={setSearch}
      filters={filters}
      setFilters={setFilters}
      onDetail={handleDetail}
      modalOpen={modalOpen}
      selectedEmployee={selectedEmployee}
      onCloseModal={() => setModalOpen(false)}
      page={page}
      setPage={setPage}
      totalCount={filtered.length}
      rowsPerPage={rowsPerPage}
    />
  );
};

export default EmployeesListCon;
