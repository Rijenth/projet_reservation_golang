import React from 'react';
import { Res } from '../types/Types';

interface ResponseProps {
    response: Res[] | [];
}

const Response: React.FC<ResponseProps> = ({ response }) => {
    return (
        <div>
            {response && response.length > 0 && (
                <div>
                    {response.map((res: Res, index) => (
                        <p
                            key={index}
                            className="bg-red-200 py-3 rounded-lg my-4 text-center text-red-800 text-base leading-8"
                        >
                            {res.detail}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Response;
