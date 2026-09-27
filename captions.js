/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Görüntü nerede?', en: 'Where is the image?',
      note: 'Kareli kâğıtta F biçiminde bir şekil ve bir simetri doğrusu var. Şeklin bu doğruya göre görüntüsü nerede olur?' },
    { scene: 2, start: 10.8, end: 17.6, tr: 'Varsayım: sağa kaydır?', en: 'Guess: slide it to the right?',
      note: 'Bir varsayım: görüntü, şeklin sağa kaydırılmış hali. Ama kaydırınca F aynı yöne bakıyor; aynadaki gibi ters dönmüyor. Varsayım tutmadı.' },
    { scene: 2, start: 18.0, end: 27.8, tr: 'Köşeleri dik, eşit uzaklığa taşı', en: 'Move each corner straight across',
      note: 'Görüntüyü nokta nokta oluşturalım: A köşesini doğruya dik olarak karşıya, aynı uzaklığa taşıyalım: A üssü. B ve C için de aynısı. Köşeleri birleştirince görüntü oluşur.' },
    { scene: 3, start: 28.6, end: 40.6, tr: 'Kenarlar ve açılar aynı', en: 'Same sides, same angles',
      note: 'Karşılaştıralım: AB ile A üssü B üssü 3 birim, AC ile A üssü C üssü 5 birim, açılar aynı. Şekil ile görüntüsü eş. Ama dönüş yönü ters: biri saat yönünde, öteki tersine.' },
    { scene: 3, start: 41.0, end: 45.8, tr: 'Eş, ama yönü ters', en: 'Congruent, but reversed',
      note: 'Yansımada şekil ve görüntüsü eştir, yönleri terstir.' },
    { scene: 4, start: 46.6, end: 57.0, tr: 'Dik ve ikiye bölünmüş', en: 'Perpendicular and halved',
      note: 'A doğrudan 6 birim uzakta, A üssü de 6 birim. A ile A üssünü birleştiren doğru parçası simetri doğrusuna dik ve ondan tam ortasından geçiyor. B ve C için de öyle.' },
    { scene: 4, start: 57.4, end: 63.8, tr: 'Simetri doğrusu: orta dikme', en: 'The mirror line: a perpendicular bisector',
      note: 'Önerme: simetri doğrusu, bir noktayı görüntüsüne bağlayan doğru parçasının orta dikmesidir.' },
    { scene: 5, start: 64.6, end: 76.6, tr: 'Simetrik mi? Doğru nerede?', en: 'Symmetric? Where is the line?',
      note: 'Önermeyi kullanalım. Eş iki üçgenin karşılıklı noktalarını birleştirelim: orta noktalar bir doğru üzerinde ve bağlar ona dik; üçgenler simetrik. Simetrik bir evde karşılıklı iki noktayı birleştirip ortasından dik çizersek simetri doğrusunu buluruz.' },
    { scene: 5, start: 77.0, end: 79.8, tr: 'Önerme işe yarıyor', en: 'The statement is useful',
      note: 'Önerme, iki şeklin simetrik olup olmadığını sınamaya ve simetri doğrusunu çizmeye yarar.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Dik, eşit uzaklık, eş şekil', en: 'Perpendicular, equal distance, congruent',
      note: 'Aklında kalsın: her noktayı doğruya dik ve eşit uzaklığa taşı. Şekil ile görüntüsü eştir, yönü terstir.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Simetri doğrusu: orta dikme!', en: 'The mirror line: a perpendicular bisector!',
      note: 'Simetri doğrusu orta dikmedir!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
