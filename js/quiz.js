import { LEVEL_TEXTS } from './config.js';

export function calculateScore(knowledgeScore, behaviorScore) {
    return {
        knowledge: knowledgeScore,
        behavior: behaviorScore,
        total: knowledgeScore + behaviorScore
    };
}

export function determineLevel(totalScore) {
    if (totalScore <= 45) return 1;
    if (totalScore <= 70) return 2;
    return 3;
}

export function getLevelText(level) {
    return LEVEL_TEXTS[level] || LEVEL_TEXTS[2];
}

export function generateAnalysis(knowledgePct, behaviorPct, knowledge, behavior) {
    const items = [];

    if (knowledgePct >= 70) {
        items.push({ good: true, text: 'Enerji verimliliği teknik bilgi düzeyiniz mükemmel seviyede.' });
    } else {
        items.push({ good: false, text: 'Temel enerji verimliliği kavramları ve teknikleri konusunda bilgi eksikliğiniz var.' });
    }

    if (behaviorPct >= 70) {
        items.push({ good: true, text: 'Günlük yaşamınızda enerji tasarrufu alışkanlıklarını başarıyla uyguluyorsunuz.' });
    } else {
        items.push({ good: false, text: 'Günlük enerji kullanım davranışlarınızda tasarruf potansiyeli yüksek.' });
    }

    if (knowledge >= 10) items.push({ good: true, text: 'Enerji etiketlerini okuma ve verimli cihaz seçimi konusunda bilinçlisiniz.' });
    if (behavior >= 60) items.push({ good: true, text: 'Ev aletleri ve aydınlatma kullanım alışkanlıklarınız verimli.' });
    if (knowledge < 7) items.push({ good: false, text: 'Isı yalıtımı ve pasif verimlilik önlemleri hakkında daha fazla bilgiye ihtiyacınız var.' });
    if (behavior < 40) items.push({ good: false, text: 'Standby (bekleme) modunda enerji tüketimi konusunda farkındalık kazanmalısınız.' });

    return items;
}
