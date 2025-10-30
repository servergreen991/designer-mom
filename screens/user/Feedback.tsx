
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const Feedback: React.FC = () => {
    const { addFeedback } = useAppContext();
    const [feedbackText, setFeedbackText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedbackText.trim()) {
            addFeedback(feedbackText);
            setFeedbackText('');
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <div className="p-6 bg-secondary min-h-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-3xl font-serif text-accent mb-4">Submit Feedback</h2>
                <p className="text-text-light mb-6">
                    We value your opinion! Please let us know how we can improve your experience.
                </p>
                
                {submitted ? (
                     <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="text-xl font-semibold text-green-700">Thank you!</h3>
                        <p className="text-green-600">Your feedback has been submitted successfully.</p>
                     </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <textarea
                            rows={8}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Share your thoughts, suggestions, or issues here..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        <div className="text-right mt-4">
                            <button
                                type="submit"
                                className="bg-accent text-white font-bold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Feedback;
