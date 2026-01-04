// Configuration Constants

export const SUPABASE_URL = 'https://hrshbpljdbyilwzuadoj.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyc2hicGxqZGJ5aWx3enVhZG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjEyMTgsImV4cCI6MjA4MjkzNzIxOH0.AcGgZePLd0DXqNvvFULTwh9mXRZ7iI66kuhpf8bHkRs';

export const LEVEL_TEXTS = {
    1: 'Düzey 1 - Temel',
    2: 'Düzey 2 - Gelişen',
    3: 'Düzey 3 - Rol Model'
};

export const MODULES = {
    1: {
        title: 'Modül 1: Enerji Verimliliğine Giriş',
        desc: 'Enerji verimliliği nedir? Konutlarda temel tüketim kaynakları ve tasarruf yöntemleri. (45 Dk)',
        videoPlaceholder: false,
        videoEmbed: '<video width="100%" height="100%" controls style="border-radius: 8px;"><source src="assets/videos/modül_1.mp4" type="video/mp4">Tarayıcınız video etiketini desteklemiyor.</video>',
        content: `
            <h4>1. Enerji Verimliliği Nedir?</h4>
            <p>Enerji verimliliği, birim hizmet veya ürün miktarında herhangi bir azalmaya neden olmadan, enerji tüketiminin azaltılmasıdır. Bu kavram, genellikle "enerji tasarrufu" ile karıştırılır, ancak aralarında temel bir fark vardır: </p>
            <ul>
                <li><strong>Enerji Tasarrufu:</strong> Davranış değişikliği veya kısıtlama yoluyla tüketimi azaltmaktır (örneğin, boş odanın ışığını kapatmak).</li>
                <li><strong>Enerji Verimliliği:</strong> Teknolojik gelişim veya yapısal iyileştirmelerle aynı işi daha az enerjiyle yapmaktır (örneğin, akkor flamanlı ampul yerine LED ampul kullanmak).</li>
            </ul>

            <h4>2. Neden Enerji Verimliliği?</h4>
            <p>Enerji verimliliği, hem bireysel hem de küresel ölçekte kritik öneme sahiptir:</p>
            <ul>
                <li><strong>Ekonomik Etki:</strong> Enerji faturalarının düşürülmesi, hane halkı bütçesine ve ulusal ekonomiye doğrudan katkı sağlar. Enerji ithalatı azalır.</li>
                <li><strong>Çevresel Etki:</strong> Daha az enerji tüketimi, fosil yakıt kullanımını ve dolayısıyla sera gazı emisyonlarını (CO2) azaltarak iklim değişikliği ile mücadeleye destek olur.</li>
            </ul>

            <h4>3. Evlerde Enerji Tüketim Dağılımı</h4>
            <p>Türkiye'deki konutlarda ortalama enerji tüketim dağılımı şöyledir:</p>
            <ul>
                <li><strong>Isıtma ve Soğutma (%40-60):</strong> En büyük enerji kalemi.</li>
                <li><strong>Beyaz Eşyalar (%30):</strong> Buzdolabı, çamaşır ve bulaşık makinesi.</li>
                <li><strong>Aydınlatma (%10):</strong> Genellikle en kolay tasarruf yapılabilecek alan.</li>
                <li><strong>Diğer Elektronikler (%10):</strong> TV, bilgisayar, şarj aletleri.</li>
            </ul>

            <h4>4. Verimlilik Stratejisi: 3 Adım</h4>
            <ol>
                <li><strong>Ölçümle:</strong> Faturanızı takip edin, hangi cihazın ne kadar tükettiğini anlayın (Enerji Ölçer prizler kullanabilirsiniz).</li>
                <li><strong>Azalt:</strong> Gereksiz kullanımları sonlandırın (Bekleme modundaki cihazlar).</li>
                <li><strong>Dönüştür:</strong> Eski, verimsiz cihazları yüksek verimli (A+++) modellerle değiştirin.</li>
            </ol>
        `
    },
    2: {
        title: 'Modül 2: Günlük Yaşamda Verimlilik',
        desc: 'Enerji etiketleri, fatura okuma, cihaz seçimi ve davranışsal değişiklikler. (60 Dk)',
        videoPlaceholder: false,
        videoEmbed: '<video width="100%" height="100%" controls style="border-radius: 8px;"><source src="assets/videos/modül_2.mp4" type="video/mp4">Tarayıcınız video etiketini desteklemiyor.</video>',
        content: `
            <h4>1. Enerji Etiketlerini Doğru Okuma</h4>
            <p>Avrupa Birliği standartlarına göre enerji etiketleri A'dan G'ye kadar sınıflandırılır. Mart 2021 itibarıyla yeni düzenlemeye geçilmiştir:</p>
            <ul>
                <li><strong>A Sınıfı (Yeşil):</strong> En yüksek verimlilik. Eski A+++ sınıfına denk gelmeyebilir, kriterler zorlaştırılmıştır.</li>
                <li><strong>G Sınıfı (Kırmızı):</strong> En düşük verimlilik.</li>
            </ul>
            <p>QR kodu okutarak ürünün detaylı enerji kimlik kartına (EPREL veritabanı) ulaşabilirsiniz.</p>

            <h4>2. Isıtma ve Yalıtım Hileleri</h4>
            <p>Isınma maliyetlerini düşürmek için pratik yöntemler:</p>
            <ul>
                <li><strong>Radyatör Arkası Levhalar:</strong> Isının duvardan dışarı kaçmasını önleyerek odaya yansıtır. (%5 Tasarruf)</li>
                <li><strong>Termostatik Vana:</strong> Her odayı ihtiyaca göre ısıtın. Oda sıcaklığını 1°C düşürmek, faturada %7 tasarruf sağlar.</li>
                <li><strong>Havalandırma:</strong> Pencereleri uzun süre yarım açmak yerine, günde 2-3 kez tam açarak 5-10 dakika hızlı havalandırma yapın. Bu, duvarların soğumasını engeller.</li>
            </ul>

            <h4>3. Cihaz Kullanımı ve Su Tasarrufu</h4>
            <ul>
                <li><strong>Çamaşır Makinesi:</strong> 60°C yerine 30°C veya 40°C'de yıkamak enerjiden %50 tasarruf sağlar. Çamaşırlarınızı tam dolulukla yıkayın.</li>
                <li><strong>Bulaşık Makinesi:</strong> Elde yıkamaya göre 10 kat daha az su harcar. Eco programları süre olarak uzundur ancak en az su ve elektriği tüketir.</li>
                <li><strong>Su Isıtıcılar (Kettle):</strong> Sadece ihtiyacınız kadar su kaynatın. Kireçlenmiş rezistanslar enerji tüketimini artırır, düzenli temizleyin.</li>
            </ul>

            <h4>4. Gizli Tüketim: Bekleme Modu (Stand-by)</h4>
            <p>Cihazları kumandadan kapatmak yetmez; fiş takılıyken "vampir enerji" tüketmeye devam ederler. TV, uydu alıcısı ve modemler yıllık elektriğin %5'ini harcayabilir. Anahtarlı priz kullanarak bu tüketimi sıfırlayın.</p>
        `
    },
    3: {
        title: 'Modül 3: Kurumsal Liderlik',
        desc: 'Kurumsal enerji kültürü, rol model olma ve çevreyi bilgilendirme stratejileri. (1 Gün)',
        videoPlaceholder: false,
        videoEmbed: '<video width="100%" height="100%" controls style="border-radius: 8px;"><source src="assets/videos/modül_3.mp4" type="video/mp4">Tarayıcınız video etiketini desteklemiyor.</video>',
        content: `
            <h4>1. İş Yerinde Enerji Kültürü Oluşturmak</h4>
            <p>Kurumsal verimlilik, bireysel farkındalıkla başlar ve kolektif bir kültüre dönüşür:</p>
            <ul>
                <li><strong>Aydınlatma Yönetimi:</strong> Toplantı odalarından çıkarken ışıkları kapatın. Mümkünse sensörlü sistemlere geçişi talep edin.</li>
                <li><strong>Ofis Ekipmanları:</strong> Bilgisayarlar ve yazıcılar kullanılmadığında "Uyku Modu"na geçmelidir. Ekran koruyucular enerji tasarrufu sağlamaz, ekranı kapatmak sağlar.</li>
                <li><strong>Dijital Temizlik:</strong> Gereksiz e-postaları silmek ve bulut depolama alanını temizlemek, veri sunucularının enerji yükünü azaltır.</li>
            </ul>

            <h4>2. Enerji Elçisi Olmak (Rol Model)</h4>
            <p>Edindiğiniz bilgileri çevrenize yayarak etkinizi artırın:</p>
            <ul>
                <li><strong>Ailede:</strong> Çocuklarınıza enerji bilincini oyunlarla öğretin.</li>
                <li><strong>İş Yerinde:</strong> "Yeşil Ofis" girişimleri başlatın veya öneri kutusuna verimlilik fikirleri atın.</li>
                <li><strong>Sosyal Çevrede:</strong> Enerji verimliliği başarı hikayelerinizi paylaşın, başkalarına ilham olun.</li>
            </ul>

            <h4>3. Sürdürülebilir Ulaşım</h4>
            <p>Ulaşım, karbon ayak izinin büyük bir kısmıdır:</p>
            <ul>
                <li>Mümkünse toplu taşıma, bisiklet veya yürüyüşü tercih edin.</li>
                <li>Araç paylaşımı (Carpooling) yaparak kişi başı emisyonu düşürün.</li>
                <li>Elektrikli veya hibrit araçlara geçişi planlayın.</li>
            </ul>

            <h4>4. Uzun Vadeli Vizyon: Net Sıfır</h4>
            <p>Küresel hedef olan "Net Sıfır Emisyon"a ulaşmak için bireysel katkı şarttır. Yenilenebilir enerji (güneş panelleri vb.) yatırımlarını araştırın ve karbon ayak izinizi yıllık olarak hesaplayıp düşürme hedefleri koyun.</p>
        `
    }
};
