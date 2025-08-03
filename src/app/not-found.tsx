'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileButton } from '../components/ui/MobileButton';
import { useIsMobile } from '../utils/responsive';

export default function NotFoundPage() {
    const router = useRouter();
    const isMobile = useIsMobile();

    // Handle GitHub Pages client-side routing
    useEffect(() => {
        const handleGitHubPagesRouting = () => {
            const path = window.location.pathname;
            const basePath = '/kids-math-quiz';

            // If we're on GitHub Pages and the path includes the base path
            if (path.includes(basePath) && path !== basePath && path !== `${basePath}/`) {
                const newPath = path.replace(basePath, '');
                if (newPath && newPath !== '/') {
                    router.push(newPath);
                }
            }
        };

        // Only run on client-side
        if (typeof window !== 'undefined') {
            handleGitHubPagesRouting();
        }
    }, [router]);

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 dark:from-red-900 dark:via-pink-800 dark:to-purple-900">
            <div className={`flex items-center justify-center ${isMobile ? 'p-4 pt-8' : 'p-4'} min-h-screen`}>
                <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${isMobile ? 'max-w-md mx-auto' : 'max-w-2xl'
                    } ${isMobile ? 'p-6' : 'p-8'} text-center animate-float`}>

                    {/* 404 Animation */}
                    <div className="mb-8">
                        <div className={`${isMobile ? 'text-6xl' : 'text-8xl'} font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 animate-bounce-gentle`}>
                            404
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className={`font-bold text-gray-800 dark:text-gray-200 mb-4 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
                            Oops! Page Not Found 🔍
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                            The page you&apos;re looking for seems to have wandered off on a math adventure!
                            Let&apos;s get you back to solving some fun problems! 🧮✨
                        </p>
                    </div>

                    {/* Fun Math Error Message */}
                    <div className={`bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-4 mb-8 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                            🤖 <strong>Math Bot says:</strong> This page equals zero! But don&apos;t worry,
                            we have plenty of other exciting math problems waiting for you!
                        </p>
                    </div>

                    {/* Navigation Options */}
                    <div className="space-y-4">
                        <MobileButton
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleGoHome}
                            icon="🏠"
                        >
                            Go Back Home
                        </MobileButton>

                        <div className="flex gap-4">
                            <MobileButton
                                variant="secondary"
                                size="md"
                                fullWidth
                                onClick={() => router.push('/quiz')}
                                icon="🎯"
                            >
                                Start Quiz
                            </MobileButton>

                            <MobileButton
                                variant="ghost"
                                size="md"
                                fullWidth
                                onClick={() => window.history.back()}
                                icon="↩️"
                            >
                                Go Back
                            </MobileButton>
                        </div>
                    </div>

                    {/* Fun Math Facts */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-600">
                        <p className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            💡 <strong>Fun Fact:</strong> Did you know that 404 = 4 × 101?
                            That&apos;s a pretty cool math pattern! 🎲
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
