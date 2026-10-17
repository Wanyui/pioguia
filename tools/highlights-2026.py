"""One-off: write `highlight` and `appliesTo` (5 languages) into the active benefits.

Source of truth: docs/rediseno/revision-ventajas.md (approved 2026-10-17). Run from the repo root:
    python3 tools/highlights-2026.py
"""
import glob
import json
import os
import re

FREE = {"es": "Gratis", "ca": "Gratis", "en": "Free", "fr": "Gratuit", "ru": "Бесплатно"}
same = lambda v: {l: v for l in ("es", "ca", "en", "fr", "ru")}

# (files, highlight, appliesTo)
ROWS = [
    (["abacus-andorra-la-vella", "juguettos-imaginarium-andorra-la-vella", "mels-andorra-la-vella"], same("−5%"),
     {"es": "no acumulable", "ca": "no acumulable", "en": "not combinable", "fr": "non cumulable", "ru": "не суммируется"}),
    (["alex-boutique-andorra-la-vella", "alex-boutique-escaldes-engordany"], same("−5%"),
     {"es": "excepto promociones", "ca": "excepte promocions", "en": "except promotions", "fr": "hors promotions", "ru": "кроме акций"}),
    (["anigami-maslescomes"], same("2x1"),
     {"es": "todas las actividades", "ca": "totes les activitats", "en": "all activities", "fr": "toutes les activités", "ru": "все активности"}),
    (["aquabrava-roses"], FREE,
     {"es": "con 1 adulto de pago", "ca": "amb 1 adult que pagui", "en": "with 1 paying adult", "fr": "avec 1 adulte payant", "ru": "с 1 платящим взрослым"}),
    (["aquarium-barcelona"], same("−3 €"),
     {"es": "hasta 5 personas", "ca": "fins a 5 persones", "en": "up to 5 people", "fr": "jusqu'à 5 personnes", "ru": "до 5 человек"}),
    (["aquopolis-pineda"], FREE,
     {"es": "de 1 a 1,40 m + 1 adulto", "ca": "d'1 a 1,40 m + 1 adult", "en": "1–1.40 m + 1 adult", "fr": "de 1 à 1,40 m + 1 adulte", "ru": "1–1,40 м + 1 взрослый"}),
    (["art-i-fusta-massana", "mountain-interiors-massana"], same("−10%"),
     {"es": "muebles y hogar", "ca": "mobles i llar", "en": "furniture and home", "fr": "meubles et maison", "ru": "мебель и дом"}),
    (["basar-valira-cotxes", "basar-valira-joguets", "basar-valira-lego", "basar-valira-trens"], same("−8%"),
     {"es": "juguetes", "ca": "joguines", "en": "toys", "fr": "jouets", "ru": "игрушки"}),
    (["benetton-via-moda-andorra-la-vella", "ovs-via-moda-andorra-la-vella", "ovs-via-moda-escaldes"], same("−10%"),
     {"es": "en puntos", "ca": "en punts", "en": "in points", "fr": "en points", "ru": "баллами"}),
    (["bici-lab-andorra-la-vella"], FREE,
     {"es": "entrada al museo", "ca": "entrada al museu", "en": "museum entry", "fr": "entrée au musée", "ru": "вход в музей"}),
    (["caldea-escaldes"], FREE,
     {"es": "3–13 años, mañanas", "ca": "3–13 anys, matins", "en": "ages 3–13, mornings", "fr": "3–13 ans, matins", "ru": "3–13 лет, утром"}),
    (["cargoleando-encamp"],
     {"es": "10 h gratis", "ca": "10 h gratis", "en": "10 h free", "fr": "10 h offertes", "ru": "10 ч бесплатно"},
     {"es": "al celebrar tu fiesta", "ca": "si celebres la teva festa", "en": "for your party", "fr": "pour ta fête", "ru": "на твой праздник"}),
    (["carnet-jove-andorra-la-vella"], FREE,
     {"es": "si tienes 12 años", "ca": "si tens 12 anys", "en": "if you're 12", "fr": "si tu as 12 ans", "ru": "если тебе 12 лет"}),
    (["casa-crist-encamp"], same("1 €"),
     {"es": "por persona", "ca": "per persona", "en": "per person", "fr": "par personne", "ru": "с человека"}),
    (["castells-montsonis"], same("2x1"),
     {"es": "entrada al castillo", "ca": "entrada al castell", "en": "castle entry", "fr": "entrée au château", "ru": "вход в замок"}),
    (["catalunya-en-miniatura-torrelles"], same("2x1"),
     {"es": "durante 2026", "ca": "durant el 2026", "en": "throughout 2026", "fr": "en 2026", "ru": "в 2026 году"}),
    (["centre-auditiu-andorra"], same("−10%"),
     {"es": "audífonos", "ca": "audiòfons", "en": "hearing aids", "fr": "appareils auditifs", "ru": "слуховые аппараты"}),
    (["centre-esportiu-ordino"], same("7 €"),
     {"es": "entrada de un día", "ca": "entrada d'un dia", "en": "day pass", "fr": "entrée à la journée", "ru": "вход на день"}),
    (["centre-esportiu-pas-de-la-casa", "complex-esportiu-encamp"], same("−10%"),
     {"es": "escuelas deportivas", "ca": "escoles esportives", "en": "sports schools", "fr": "écoles sportives", "ru": "спортивные школы"}),
    (["coves-espluga-francoli", "crarc-masquefa"], FREE,
     {"es": "el socio", "ca": "el soci", "en": "the member", "fr": "le membre", "ru": "член клуба"}),
    (["dehesa-santa-maria-escaldes-engordany"], same("−10%"),
     {"es": "cumple: crep + zumo", "ca": "aniversari: crep + suc", "en": "birthday: crêpe + juice", "fr": "anniv : crêpe + jus", "ru": "день рожд.: блин + сок"}),
    (["dinopolis-teruel"], same("−15%"),
     {"es": "tú + 3 acompañantes", "ca": "tu + 3 acompanyants", "en": "you + 3 companions", "fr": "toi + 3 accompagnants", "ru": "ты + 3 спутника"}),
    (["elsblaus-rosescentre", "elsblaus-rosesoficina", "elsblaus-santamargarita"], FREE,
     {"es": "0–12 años", "ca": "0–12 anys", "en": "ages 0–12", "fr": "0–12 ans", "ru": "0–12 лет"}),
    (["espai-de-musica-andorralavella", "espai-de-musica-santjulia"], same("−25%"),
     {"es": "1.ª matrícula, +5 años", "ca": "1a matrícula, +5 anys", "en": "1st enrolment, 5+", "fr": "1re inscription, 5 ans+", "ru": "1-я запись, 5+ лет"}),
    (["experiencia-muntanya-ordino"], same("−10%"),
     {"es": "con 2 adultos, online", "ca": "amb 2 adults, en línia", "en": "with 2 adults, online", "fr": "avec 2 adultes, en ligne", "ru": "с 2 взрослыми, онлайн"}),
    (["fundacio-mona-riudellots"], FREE,
     {"es": "el socio, con reserva", "ca": "el soci, amb reserva", "en": "the member, booking", "fr": "le membre, sur réservation", "ru": "член клуба, по записи"}),
    (["grandvalira-esqui", "grandvalira-esqui-canillo", "grandvalira-esqui-el-tarter", "grandvalira-esqui-grau-roig",
      "grandvalira-esqui-pas-de-la-casa", "grandvalira-esqui-soldeu"], same("−10%"),
     {"es": "clases infantiles", "ca": "classes infantils", "en": "kids' lessons", "fr": "cours enfants", "ru": "детские уроки"}),
    (["hipica-aldosa-massana"], same("−10%"),
     {"es": "paseos y clases", "ca": "passejades i classes", "en": "rides and lessons", "fr": "balades et cours", "ru": "прогулки и уроки"}),
    (["karate-xavi-escaldes", "karate-xavi-massana", "karate-xavi-ordino"], same("−10%"),
     {"es": "cuota + matrícula gratis", "ca": "quota + matrícula gratis", "en": "fee + free enrolment", "fr": "cotisation + inscription offerte", "ru": "взнос + запись бесплатно"}),
    (["karting-elpladesanttirs"], same("3x2"),
     {"es": "tandas; +1 en tu cumple", "ca": "tandes; +1 el teu aniversari", "en": "laps; +1 on your birthday", "fr": "sessions ; +1 à ton anniv", "ru": "заезды; +1 в день рожд."}),
    (["la-granja-santa-maria-palau"], same("−10%"),
     {"es": "colonias", "ca": "colònies", "en": "summer camps", "fr": "colonies", "ru": "лагеря"}),
    (["lauesport-sant-julia"], FREE,
     {"es": "piscina en vacaciones", "ca": "piscina en vacances", "en": "pool in school holidays", "fr": "piscine en vacances", "ru": "бассейн на каникулах"}),
    (["les-delicies-del-jimmy-canillo", "les-delicies-del-jimmy-escaldes-engordany"], same("−10%"),
     {"es": "pastel de cumpleaños", "ca": "pastís d'aniversari", "en": "birthday cake", "fr": "gâteau d'anniversaire", "ru": "торт на день рожд."}),
    (["marimurtra-blanes"], FREE,
     {"es": "niños", "ca": "nens", "en": "kids", "fr": "enfants", "ru": "дети"}),
    (["marina-diving-ametlla"], same("2x1"),
     {"es": "todas las actividades", "ca": "totes les activitats", "en": "all activities", "fr": "toutes les activités", "ru": "все активности"}),
    (["marineland-palafolls"], same("−4 €"),
     {"es": "hasta 5, con el QR", "ca": "fins a 5, amb el QR", "en": "up to 5, with the QR", "fr": "jusqu'à 5, avec le QR", "ru": "до 5, по QR-коду"}),
    (["mina-de-llorts-ordino", "mola-i-serradora-de-cal-pal-ordino"], FREE,
     {"es": "niños con 1 adulto", "ca": "nens amb 1 adult", "en": "kids with 1 adult", "fr": "enfants avec 1 adulte", "ru": "дети с 1 взрослым"}),
    (["mont-magic-canillo"], same("−10%"),
     {"es": "verano 2026", "ca": "estiu 2026", "en": "summer 2026", "fr": "été 2026", "ru": "лето 2026"}),
    (["museu-joc-figueres"], FREE,
     {"es": "el socio con 1 adulto", "ca": "el soci amb 1 adult", "en": "member with 1 adult", "fr": "le membre avec 1 adulte", "ru": "член клуба с 1 взрослым"}),
    (["museus-monuments-andorra-la-vella", "mw-electricitat-encamp"], FREE,
     {"es": "tú, padres y hermanos", "ca": "tu, pares i germans", "en": "you, parents, siblings", "fr": "toi, parents, frères et sœurs", "ru": "ты, родители, братья и сёстры"}),
    (["naturland-sant-julia"],
     {"es": "2 gratis", "ca": "2 gratis", "en": "2 free", "fr": "2 gratuits", "ru": "2 бесплатно"},
     {"es": "por 1 entrada de adulto", "ca": "per 1 entrada d'adult", "en": "per adult ticket", "fr": "pour 1 entrée adulte", "ru": "за 1 взрослый билет"}),
    (["ofijet-escaldes"], same("−10%"),
     {"es": "outlet hasta −50%", "ca": "outlet fins a −50%", "en": "outlet up to −50%", "fr": "outlet jusqu'à −50%", "ru": "аутлет до −50%"}),
    (["pal-arinsal-massana"], same("−10%"),
     {"es": "clases y Bike World", "ca": "classes i Bike World", "en": "lessons and Bike World", "fr": "cours et Bike World", "ru": "уроки и Bike World"}),
    (["palau-de-gel-canillo"], FREE,
     {"es": "hasta 10 años", "ca": "fins a 10 anys", "en": "up to age 10", "fr": "jusqu'à 10 ans", "ru": "до 10 лет"}),
    (["parc-olimpic-segre"], FREE,
     {"es": "1 actividad por adulto", "ca": "1 activitat per adult", "en": "1 activity per adult", "fr": "1 activité par adulte", "ru": "1 занятие на взрослого"}),
    (["pic-negre-massana", "shusski-encamp"], same("−15%"),
     {"es": "ropa; −10% alquiler", "ca": "roba; −10% lloguer", "en": "clothing; −10% rental", "fr": "vêtements ; −10% location", "ru": "одежда; −10% прокат"}),
    (["piscina-massana"], same("6 €"),
     {"es": "entrada infantil", "ca": "entrada infantil", "en": "child ticket", "fr": "entrée enfant", "ru": "детский билет"}),
    (["pollyanna-baby-escaldes", "pollyanna-kids-escaldes"], same("−5%"),
     {"es": "al registrarte", "ca": "si et registres", "en": "when you sign up", "fr": "en t'inscrivant", "ru": "при регистрации"}),
    (["portaventura-world-vilaseca"], FREE,
     {"es": "niño ≤13 + 1 adulto", "ca": "nen ≤13 + 1 adult", "en": "child ≤13 + 1 adult", "fr": "enfant ≤13 + 1 adulte", "ru": "ребёнок ≤13 + 1 взрослый"}),
    (["princi-esport-santa-coloma"], same("−5%"),
     {"es": "campus y cumpleaños", "ca": "campus i aniversaris", "en": "camps and birthdays", "fr": "stages et anniversaires", "ru": "лагеря и дни рожд."}),
    (["rocroi-grau-roig"], same("−10%"),
     {"es": "actividades de nieve", "ca": "activitats de neu", "en": "snow activities", "fr": "activités neige", "ru": "зимние активности"}),
    (["rocroi-llavorsi"], same("2x1"),
     {"es": "rafting y kayak", "ca": "ràfting i caiac", "en": "rafting and kayak", "fr": "rafting et kayak", "ru": "рафтинг и каяк"}),
    (["rocroi-vilanova"], same("−50%"),
     {"es": "alquiler 2 h", "ca": "lloguer 2 h", "en": "2 h rental", "fr": "location 2 h", "ru": "прокат 2 ч"}),
    (["silene-andorra-la-vella"], same("9 €"),
     {"es": "corte, los martes", "ca": "tall, els dimarts", "en": "haircut, Tuesdays", "fr": "coupe, le mardi", "ru": "стрижка, по вторникам"}),
    (["singular-andorra-la-vella"], same("−10%"),
     {"es": "matrícula de inglés", "ca": "matrícula d'anglès", "en": "English enrolment", "fr": "inscription en anglais", "ru": "запись на английский"}),
    (["tibet-massana"], same("−10%"),
     {"es": "excepto peluquería", "ca": "excepte perruqueria", "en": "except hairdressing", "fr": "sauf coiffure", "ru": "кроме парикмахерской"}),
]


def block(key, values):
    return f"{key}:\n" + "".join(f"  {l}: {json.dumps(values[l], ensure_ascii=False)}\n" for l in ("es", "ca", "en", "fr", "ru"))


done = set()
for files, highlight, applies in ROWS:
    for name in files:
        path = f"src/content/benefits/{name}.md"
        text = open(path, encoding="utf-8").read()
        text = re.sub(r"^(highlight|appliesTo):\n(?:  \w\w: .*\n)+", "", text, flags=re.M)
        text = re.sub(r"^(category: .*\n)", lambda m: m.group(1) + block("highlight", highlight) + block("appliesTo", applies),
                      text, count=1, flags=re.M)
        open(path, "w", encoding="utf-8").write(text)
        done.add(name)

active = {os.path.basename(p)[:-3] for p in glob.glob("src/content/benefits/*.md")}
print(f"aplicadas: {len(done)} / activas: {len(active)}")
print("sin etiqueta:", sorted(active - done) or "ninguna")
