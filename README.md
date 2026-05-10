# CloudFide Recruitment Task - FileTree Explorer
Aplikacja do wizualizacji drzewa plików/folderów na podstawie JSON z możliwością:
- importu JSON (paste / upload),
- nawigacji po drzewie,
- szczegółów węzła,
- wyszukiwania globalnego po nazwie.

## Tech Stack
- React + TypeScript (strict mode)
- React Router v6
- Vite
- Tailwind CSS
- Vitest (testy jednostkowe utils)

## Uruchomienie
```bash
npm install
npm run dev
```

## Build produkcyjny
```bash
npm run build
```

## Testy
```bash
npm run test
npm run test:coverage
```

## Routing
* / - import JSON (textarea + upload pliku)
* /tree - widok drzewa
* /tree/:nodePath - szczegóły węzła (file/folder)

## Decyzje architektoniczne
1) Model danych: tree jako source of truth

Stan aplikacji przechowuje drzewo treeNode jako główny model domenowy.  
Widok listy nie jest trzymany osobno w stanie, tylko wyliczany na bieżąco przez spłaszczenie drzewa do listy widocznych elementów (`flattenTree`).

Wybrałem to podejście, ponieważ wcześniej sprawdziło mi się w praktyce przy implementacji eksploratora plików i dobrze skaluje się wraz ze wzrostem złożoności funkcji.

Korzyści:
- łatwiejsza rozbudowa o kolejne funkcje (np. DnD, reorder, lazy loading),
- spójna i przewidywalna kontrola stanu folderów (`isOpen`),
- prostsze testowanie logiki niezależnie od warstwy UI.

2) Algorytm renderowania listy
```flattenTree(...)```

* przechodzi DFS po drzewie,
* dodaje do listy tylko widoczne elementy,
* rozwija dzieci folderu wyłącznie gdy isOpen === true.

Dzięki temu UI renderuje linearną listę, ale zachowuje strukturę drzewa przez depth i path.

3) Runtime validation wejścia
```parseTreeFromJson(...)``` waliduje:

* poprawność JSON,
* poprawność typów pól (name, type, size, children),
* rozróżnienie file/folder na poziomie runtime.

To chroni UI przed niepoprawnym wejściem i daje czytelne komunikaty błędów.

4) Persystencja w localStorage
Przechowywane są:

* aktualne drzewo,
* fraza wyszukiwania.

Efekt: odświeżenie strony nie gubi kontekstu użytkownika.

5) Podział na feature modules
Kod jest podzielony na:

* features/fileTree/types.ts
* features/fileTree/parser.ts
* features/fileTree/treeUtils.ts
* features/fileTree/storage.ts
* strony (pages/*)

To redukuje coupling i ułatwia utrzymanie.

## Co działa

* import JSON przez textarea i upload pliku,
* walidacja struktury JSON,
* przejście do /tree po poprawnym wczytaniu,
* expand/collapse folderów,
* linkowanie do szczegółów przez nodePath,
* szczegóły pliku:
  * nazwa,
  * rozmiar (B / KB / MB),
  * pełna ścieżka,
* szczegóły folderu:
  * nazwa,
  * liczba bezpośrednich dzieci,
  * całkowity rozmiar poddrzewa,
  * lista dzieci z linkami,
* wyszukiwanie po nazwie w całym drzewie + pełne ścieżki wyników,
* persystencja danych po refreshu,
* testy jednostkowe kluczowych utili.

## Co zrobiłbym przy większej ilości czasu

1. Dodałbym drag & drop (przenoszenie plików/folderów) z pełną walidacją edge-case’ów:
- zakaz cykli (folder do własnego poddrzewa),
- aktualizacja order/position,
- testy integracyjne DnD.

2. Dodałbym testy komponentowe (React Testing Library) dla:
- HomePage flow,
- TreePage expand/collapse/search,
- NodeDetailsPage.

3. Dodałbym lepsze UX dla bardzo dużych drzew:
- wirtualizacja listy (np. react-virtual),
- debouncing search.

4. Dodałbym lepszą obsługę błędów parsera:
- precyzyjna ścieżka błędu i sugestie naprawy.

## Znane ograniczenia
- Identyfikacja węzłów oparta o path (jeśli byłyby duplikaty nazw w tym samym folderze, path może być niejednoznaczny).
- Brak backendu - dane trzymane lokalnie w localStorage.
- Brak DnD w aktualnej wersji (świadoma decyzja scope/time).