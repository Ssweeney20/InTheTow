import React, { useState } from 'react';
import { MessageCircle, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QuestionAnswer = ({ data, canAnswer = false }) => {

    const { user: currUser } = useAuthContext()
    const question = data;
    const [isAnswering, setIsAnswering] = useState(false);
    const [answerText, setAnswerText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) return 'just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays === 1) return 'yesterday';
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await fetch(`${API_BASE_URL}reviews/answer/${question._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answerText, questionID: question._id })
            });

            if (!response.ok) throw new Error('Failed to submit answer');

            setIsAnswering(false);
            setAnswerText('');

            window.location.reload();

        } catch (err) {
            console.error(err);
            setSubmitError('Could not submit answer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasAnswer = question.answerText && question.answerText.trim() !== '';


    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            {/* Question Section */}
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="font-medium text-gray-900">
                                {question.askedBy?.displayName || 'Anonymous'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">
                                {formatDate(question.createdAt)}
                            </span>
                        </div>

                        {hasAnswer ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Answered
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Unanswered
                            </span>
                        )}
                    </div>

                    {/* Question Text */}
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {question.questionText}
                    </p>
                </div>
            </div>

            {/* Answer Section */}
            {
                (hasAnswer ? (
                    <div className="mt-4 ml-11 pl-4 border-l-2 border-blue-200 bg-blue-50 rounded-r-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                                <User className="h-3 w-3 text-blue-700" />
                            </div>
                            <span className="text-sm font-medium text-blue-900">
                                {question.originalReviewAuthor?.displayName || 'Author'}
                            </span>
                            <span className="text-xs text-blue-600">
                                (Original Reviewer)
                            </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {question.answerText}
                        </p>
                    </div>
                ) : currUser && (
                    <div className="mt-4 ml-11">
                        {canAnswer && !isAnswering ? (
                            <button
                                onClick={() => setIsAnswering(true)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                Answer this question
                            </button>
                        ) : canAnswer && isAnswering ? (
                            <form onSubmit={handleSubmitAnswer} className="space-y-3">
                                <textarea
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="Share your answer..."
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors resize-none"
                                    autoFocus
                                    disabled={isSubmitting}
                                />
                                {submitError && (
                                    <div className="text-sm text-red-600">{submitError}</div>
                                )}
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAnswering(false);
                                            setAnswerText('');
                                            setSubmitError('');
                                        }}
                                        disabled={isSubmitting}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!answerText.trim() || isSubmitting}
                                        className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Answer'}
                                    </button>
                                </div>
                            </form>
                        ) : null}
                    </div>
                ))}
        </div>
    );
};

export default QuestionAnswer;