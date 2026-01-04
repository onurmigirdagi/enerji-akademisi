// Assessment Data

export const knowledgeQuestions = [
    { text: "Enerji verimliliğinin temel amacı aşağıdakilerden hangisidir?", options: ["Enerji tüketimini tamamen ortadan kaldırmak", "Aynı hizmeti daha az enerji kullanarak sağlamak", "Enerji fiyatlarını düşürmek", "Yalnızca yenilenebilir enerji kullanmak"], correct: 1 },
    { text: "Konutlarda toplam enerji tüketimi içinde en yüksek pay genellikle hangi alana aittir?", options: ["Aydınlatma", "Isıtma ve soğutma", "Elektronik cihazlar", "Küçük ev aletleri"], correct: 1 },
    { text: "A++ enerji sınıfı bir elektrikli cihaz neyi ifade eder?", options: ["Yüksek güç tüketimini", "Enerji verimliliği yüksek ürünü", "Daha ucuz ürünü", "Kısa kullanım ömrünü"], correct: 1 },
    { text: "LED ampuller, akkor flamanlı ampullere kıyasla yaklaşık ne kadar daha az enerji tüketir?", options: ["%10–20", "%30–40", "%70–80", "%90–100"], correct: 2 },
    { text: "Bir elektrikli su ısıtıcısının ortalama güç tüketimi hangi aralıktadır?", options: ["200–400 W", "800–1000 W", "1500–2000 W", "3000 W üzeri"], correct: 2 },
    { text: "Isı yalıtımı yapılmış bir binada aşağıdakilerden hangisi sağlanır?", options: ["Enerji tüketiminin artması", "Isı kayıplarının azaltılması", "Yalnızca yaz aylarında konfor", "Elektrik tesisatının korunması"], correct: 1 },
    { text: "Enerji Kimlik Belgesi (EKB) hangi yapılar için zorunludur?", options: ["Motorlu taşıtlar", "Sanayi makineleri", "Binalar", "Elektronik cihazlar"], correct: 2 },
    { text: "Stand-by (bekleme) modundaki cihazlar için hangisi doğrudur?", options: ["Enerji tüketmezler", "Düşük düzeyde ancak sürekli enerji tüketirler", "Sadece gece saatlerinde enerji tüketirler", "Yalnızca eski cihazlarda görülür"], correct: 1 },
    { text: "Çift camlı pencerelerin temel faydası aşağıdakilerden hangisidir?", options: ["Aydınlatma ihtiyacını azaltması", "Isı ve ses kayıplarını azaltması", "Elektrik tüketimini artırması", "Nem oluşumunu tamamen engellemesi"], correct: 1 },
    { text: "Klima kullanımında enerji verimliliği açısından önerilen iç ortam sıcaklığı kaç °C'dir?", options: ["16–18 °C", "18–20 °C", "24–26 °C", "28–30 °C"], correct: 2 },
    { text: "Aşağıdakilerden hangisi pasif enerji verimliliği önlemi olarak değerlendirilir?", options: ["Yüksek verimli klima kullanımı", "Isı yalıtımı yapılması", "LED aydınlatma kullanımı", "Akıllı sayaç kurulumu"], correct: 1 },
    { text: "Elektrikli cihazlarda bulunan enerji etiketi hangi bilgiyi sunar?", options: ["Sadece satış fiyatını", "Enerji tüketimi ve verimlilik sınıfını", "Garanti süresini", "Üretim yerini"], correct: 1 },
    { text: "Aşağıdakilerden hangisi enerji tasarrufu sağlayan doğru bir uygulamadır?", options: ["Çamaşır makinesini yarım yükle çalıştırmak", "Tam dolu çalıştırmayı tercih etmek", "Yüksek sıcaklıkta yıkama yapmak", "Cihazları sürekli prizde bırakmak"], correct: 1 }
];

export const behaviorQuestions = [
    { text: "Kullanmadığım elektrikli cihazların fişini prizden çekerim." },
    { text: "Konutumda LED veya enerji tasarruflu ampuller kullanırım." },
    { text: "Isıtma ve soğutma sistemlerini gereğinden yüksek ayarlamam." },
    { text: "Beyaz eşyaları tam dolu çalıştırmaya özen gösteririm." },
    { text: "Yeni bir cihaz satın alırken enerji verimliliği sınıfını dikkate alırım." },
    { text: "Gün ışığından mümkün olduğunca faydalanırım." },
    { text: "Elektrik ve doğal gaz faturalarımı düzenli olarak takip ederim." },
    { text: "Klima çalışırken kapı ve pencereleri kapalı tutarım." },
    { text: "Su ısıtıcısını yalnızca ihtiyaç kadar doldururum." },
    { text: "Konutumda ısı yalıtımı konusunda bilgi sahibiyim." },
    { text: "Enerji verimliliğine yönelik kamu duyuru ve kampanyalarını takip ederim." },
    { text: "Yaz aylarında doğal havalandırmayı tercih ederim." },
    { text: "Kamu binalarında enerji tasarrufuna yönelik uygulamalara uyarım." },
    { text: "Çalışma ortamında gereksiz aydınlatmaları kapatırım." },
    { text: "Enerji tasarrufu konusunda çevremdekileri bilinçlendirmeye çalışırım." },
    { text: "Uzun süreli evden ayrılışlarda elektrikli cihazları kapatırım." },
    { text: "Günlük yaşamımda enerji verimliliğini öncelikli bir konu olarak görürüm." }
];

export function getFullQuestions() {
    return [
        ...knowledgeQuestions.map((q, i) => ({
            type: 'knowledge',
            number: i + 1,
            text: q.text,
            options: q.options,
            correct: q.correct
        })),
        ...behaviorQuestions.map((q, i) => ({
            type: 'behavior',
            number: i + 14,
            text: q.text
        }))
    ];
}
