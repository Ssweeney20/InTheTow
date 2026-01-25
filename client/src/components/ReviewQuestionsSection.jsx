import React from 'react';
import { MessageCircle } from 'lucide-react';
import QuestionAnswer from './QuestionAnswer';

const ReviewQuestionsSection = ({ questions = [], reviewId, reviewAuthorId, currentUserId }) => {
    // verify if questions have been answered or not, creating arrays
    const answeredQuestions = questions.filter(q => q.answerText && q.answerText.trim() !== '');
    const unansweredQuestions = questions.filter(q => !q.answerText || q.answerText.trim() === '');

    return (
        <div className="mt-6 pt-6 border-t border-gray-200">
            {/* Section Header */}
            <div className="flex items-center space-x-2 mb-4">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                    Questions & Answers
                </h3>
                <span className="text-sm text-gray-500">
                    ({questions.length})
                </span>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {/* Unanswered questions */}
                {unansweredQuestions.length > 0 && (
                    <div>
                        {unansweredQuestions.length > 0 && answeredQuestions.length > 0 && (
                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <span className="flex items-center justify-center w-5 h-5 bg-yellow-100 text-yellow-800 rounded-full text-xs mr-2">
                                    {unansweredQuestions.length}
                                </span>
                                Awaiting Answer
                            </h4>
                        )}
                        {unansweredQuestions.map((q, i) => (
                            <div key={q._id || i} className="mb-3">
                                <QuestionAnswer 
                                    data={q} 
                                    canAnswer={currentUserId === reviewAuthorId}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Show answered questions */}
                {answeredQuestions.length > 0 && (
                    <div>
                        {unansweredQuestions.length > 0 && (
                            <h4 className="text-sm font-medium text-gray-700 mb-3 mt-6 flex items-center">
                                <span className="flex items-center justify-center w-5 h-5 bg-green-100 text-green-800 rounded-full text-xs mr-2">
                                    {answeredQuestions.length}
                                </span>
                                Answered
                            </h4>
                        )}
                        {answeredQuestions.map((q, i) => (
                            <div key={q._id || i} className="mb-3">
                                <QuestionAnswer 
                                    data={q}
                                    canAnswer={currentUserId === reviewAuthorId}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewQuestionsSection;