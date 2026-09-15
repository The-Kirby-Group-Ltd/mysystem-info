import "../styles/app-styles/events-calendar/EventsCalendar.css";

import {
    useMemo,
    useState,
} from "react";

import CalendarGrid from "../components/events-calendar/CalendarGrid";

const EventsCalendar = () => {
    const today = new Date();

    const [selectedYear, setSelectedYear] = 
        useState(today.getFullYear());
    
    const [selectedMonth, setSelectedMonth] = 
        useState(today.getMonth());

    // =====================================================
	// Date heading
	// =====================================================

    const monthLabel = useMemo(() => {
        return new Date(
            selectedYear, selectedMonth, 1
        ).toLocaleDateString(
            "en-GB", 
            {
                month: "long",
                year: "numeric",
            }
        );
    }, [
        selectedYear,
        selectedMonth,
    ]);

    // =====================================================
	// Navigation
	// =====================================================

    const handlePreviousMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear((year) => year - 1);

            return;
        }

        setSelectedMonth((month) => month - 1);
    }

    const handleNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear((year) => year + 1);

            return;
        }

        setSelectedMonth((month) => month + 1);
    }

    const handleToday = () => {
        const currentDate = new Date();

        setSelectedYear(currentDate.getFullYear());
        setSelectedMonth(currentDate.getMonth());
    }

    // =====================================================
	// Render
	// =====================================================

    return (
        <div className="events-calendar-screen">

            {/* =================================================
			    Header
			================================================= */}

            <div className="events-calendar-header">
                <div>
                    <p className="events-calendar-eyebrow">
                        Service Schedule
                    </p>

                    <h1 className="events-calendar-heading">
                        Events Calendar
                    </h1>

                    <p className="events-calendar-subtitle">
                        View scheduled calls and upcoming 
                        system maintenance. 
                    </p>
                </div>
            </div>

            {/* =================================================
			    Calendar
			================================================= */}

            <section className="events-calendar-card">
                <div className="events-calendar-toolbar">
                    <div>
                        <p className="events-calendar-section-eyebrow">
                            Calendar
                        </p>

                        <h2>
                            {monthLabel}
                        </h2>
                    </div>

                    <div className="events-calendar-navigation">
                        <button
                            type="button"
                            onClick={handlePreviousMonth}
                            aria-label="Previous Month"
                            title="Previous Month"
                        >
                            {"<"}
                        </button>

                        <button
                            type="button"
                            onClick={handleToday}
                            aria-label="Today"
                            title="Today"
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={handleNextMonth}
                            aria-label="Next Month"
                            title="Next Month"
                        >
                            {">"}
                        </button>
                    </div>
                </div>

                <CalendarGrid 
                    year={selectedYear}
                    month={selectedMonth}
                />
            </section>

        </div>
    )
}

export default EventsCalendar;