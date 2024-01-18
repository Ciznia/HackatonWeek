import { useState } from 'react';
import './employee.css';

import pro from '../photos/pro/CASTEX-David.jpg';
import fun from '../photos/fun/CASTEX-David.jpg';

export const Employee = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const img = [pro, fun];

    function onMouseEnter(index) {
        setHoveredIndex(index);
    }

    function onMouseLeave() {
        setHoveredIndex(null);
    }

    return (
        <div className="employee-container">
            {[...Array(18)].map((_, index) => (
                <div
                    key={index}
                    className={`image-wrapper ${hoveredIndex === index ? 'hovered' : ''}`}
                    onMouseEnter={() => onMouseEnter(index)}
                    onMouseLeave={onMouseLeave}
                >
                    <img
                        src={hoveredIndex === index ? img[1] : img[0]}
                        alt={hoveredIndex === index ? "Fun image" : "Professional image"}
                    />
                    {hoveredIndex === index && (
                        <div className="overlay">
                            <div className="overlay-content">
                                David CASTEX
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};