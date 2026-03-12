export interface AnalyticsService {
    id: string;
    counterId?: number;
    name: string;
    description: string;
    privacyUrl: string;
    enabled: boolean;
    optOutUrl?: string;
}

export const analyticsServices: AnalyticsService[] = [
    {
        id: 'yandex-metrika',
        counterId: 22869793,
        name: 'Яндекс.Метрика',
        description:
            'Сбор статистики посещений: страницы, время на сайте, источники трафика. Помогает улучшать контент и удобство сайта.',
        privacyUrl: 'https://yandex.ru/legal/confidential/',
        enabled: true,
        optOutUrl: 'https://yandex.ru/support/metrica/general/opt-out.html',
    },
];

export const enabledAnalytics = analyticsServices.filter((s) => s.enabled);

export function hasAnalyticsConsent(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('analytics-consent') === 'accepted';
}

export function acceptAnalyticsConsent(): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('analytics-consent', 'accepted');
        localStorage.setItem(
            'analytics-consent-date',
            new Date().toISOString()
        );
    }
}

export function shouldShowCookieBanner(): boolean {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('analytics-consent');
}
