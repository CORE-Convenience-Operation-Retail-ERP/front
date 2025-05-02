import { useState } from 'react';

function useCalendarControl() {
    const today = new Date();

    const [visibleMonth, setVisibleMonth] = useState(today.getMonth());
    const [visibleYear, setVisibleYear] = useState(today.getFullYear());
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    const handleMonthChange = (e) => {
        setVisibleMonth(Number(e.target.value));
        setShowMonthDropdown(false);
    };

    const handleYearChange = (e) => {
        setVisibleYear(Number(e.target.value));
        setShowYearDropdown(false);
    };

    const handleIncreaseMonth = () => {
        if (visibleMonth === 11) {
            setVisibleMonth(0);
            setVisibleYear((prev) => prev + 1);
        } else {
            setVisibleMonth((prev) => prev + 1);
        }
    };

    const handleDecreaseMonth = () => {
        if (visibleMonth === 0) {
            setVisibleMonth(11);
            setVisibleYear((prev) => prev - 1);
        } else {
            setVisibleMonth((prev) => prev - 1);
        }
    };

    const handleNextYear = () => setVisibleYear((prev) => prev + 1);
    const handlePreviousYear = () => setVisibleYear((prev) => prev - 1);

    return {
        visibleMonth,
        setVisibleMonth,
        visibleYear,
        setVisibleYear,
        showMonthDropdown,
        setShowMonthDropdown,
        showYearDropdown,
        setShowYearDropdown,
        handleMonthChange,
        handleYearChange,
        handleIncreaseMonth,
        handleDecreaseMonth,
        handleNextYear,
        handlePreviousYear,
    };
}

export default useCalendarControl;