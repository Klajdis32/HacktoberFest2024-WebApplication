import "./participants.css";
import { AuthContext } from "../../context/AuthContext.js";
import { useEffect, useContext, useState } from "react";

const Participants = () => {
    const [participants, setParticipants] = useState([]);
    const { getParticipants } = useContext(AuthContext); 
    const [currentPage, setCurrentPage] = useState(1);
    const participantsPerPage = 5; // Αριθμός συμμετεχόντων ανά σελίδα

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const items = await getParticipants();
                setParticipants(items); 
            } catch (error) {
                console.error("Error fetching participants:", error);
            }
        };

        fetchParticipants();
    }, [getParticipants]);

    // Ταξινόμηση των συμμετεχόντων με βάση το ID από το μεγαλύτερο προς το μικρότερο
    const sortedParticipants = participants.sort((a, b) => b.id - a.id);

    // Υπολογίζουμε τους συμμετέχοντες που θα εμφανίζονται στην τρέχουσα σελίδα
    const indexOfLastParticipant = currentPage * participantsPerPage;
    const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
    const currentParticipants = sortedParticipants.slice(indexOfFirstParticipant, indexOfLastParticipant);

    // Υπολογισμός συνολικού αριθμού σελίδων
    const totalPages = Math.ceil(participants.length / participantsPerPage);

    // Συνάρτηση για την αλλαγή σελίδας
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);

        // Μετακίνηση στην κορυφή της σελίδας
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Ομαλή μετάβαση στην κορυφή
        });
    };

    // Λογική για εμφάνιση έως 10 αριθμών σελίδων
    const visiblePages = () => {
        const pageNumbers = [];
        const maxVisiblePages = 10; // Αριθμός σελίδων που εμφανίζονται ταυτόχρονα
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(currentPage - halfVisible, 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        // Προσαρμογή αν είμαστε κοντά στο τέλος
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    // Συνάρτηση για μετατροπή ημερομηνίας σε αμερικανική μορφή MM/DD/YYYY
    const formatDateToAmerican = (dateString) => {
        const date = new Date(dateString);
        
        // Έλεγχος αν η ημερομηνία είναι έγκυρη
        if (isNaN(date.getTime())) {
            console.error("Invalid date:", dateString);
            return "Invalid Date";
        }

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Προσθήκη 0 αν χρειάζεται
        const day = date.getDate().toString().padStart(2, '0'); // Προσθήκη 0 αν χρειάζεται

        // Επιστροφή ημερομηνίας στη μορφή MM/DD/YYYY
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="Participants">
            <div className="Partext">
                <h1> <span id="togt">&gt;</span>Participants</h1>
            </div>

            <div className="partList">
                {participants.length > 0 ? (
                    currentParticipants.map((participant, index) => (
                        <div className="participant" key={index}>
                            {participant.name && (
                                <div>
                                    <span className="greenSpan">NAME:</span>
                                    <span className="whiteSpan">{participant.name}</span>
                                </div>
                            )}

                            {participant.lastname && (
                                <div>
                                    <span className="greenSpan">LAST NAME:</span>
                                    <span className="whiteSpan">{participant.lastname}</span>
                                </div>
                            )}

                            {participant.gitlabId && (
                                <div>
                                    <span className="greenSpan">GITLAB ID:</span>
                                    <span className="whiteSpan">{participant.gitlabId}</span>
                                </div>
                            )}

                            {participant.kaggleId && (
                                <div>
                                    <span className="greenSpan">KAGGLE ID:</span>
                                    <span className="whiteSpan">{participant.kaggleId}</span>
                                </div>
                            )}

                            {participant.registerDate && (
                                <div>
                                    <span className="greenSpan">REGISTRATION DATE:</span>
                                    <span className="whiteSpan">{formatDateToAmerican(participant.registerDate)}</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="noPart">No participants so far...</div>
                )}
            </div>

            {/* Κουμπιά σελίδωσης - εμφάνιση μόνο αν υπάρχουν 5 ή περισσότεροι συμμετέχοντες */}
            {participants.length >= 5 && (
                <div className="pagination">
                    {visiblePages().map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className="tonumberButt"
                            id={currentPage === pageNumber ? 'active' : ''}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Participants;
