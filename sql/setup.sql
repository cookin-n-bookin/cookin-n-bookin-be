-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS books_users CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS users_recipes CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE books (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  image_id TEXT NOT NULL
);

CREATE TABLE books_users (
  book_id BIGINT REFERENCES books(id),
  user_id BIGINT REFERENCES users(id)
);

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  book_id BIGINT REFERENCES books(id),
  page_number BIGINT,
  ingredients TEXT [],
  rating SMALLINT,
  CONSTRAINT rating CHECK (rating BETWEEN 1 AND 5),
  image_id TEXT
);

CREATE TABLE notes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content TEXT NOT NULL,
  private BOOLEAN,
  user_id BIGINT REFERENCES users(id),
  recipe_id BIGINT REFERENCES books(id)
);

CREATE TABLE users_recipes (
  user_id BIGINT REFERENCES users(id),
  recipe_id BIGINT REFERENCES recipes(id),
  cooked BOOLEAN

);

INSERT INTO 
books (title, author, image_id)
VALUES
('Foodheim', 'Eric Wareheim', 'rryvwl6wktkziup0kbca'), --1 
('Cook This Book', 'Molly Baz', 'nugksb4tqxfmvxdittdf'), --2
('Xi''an Famous Foods', 'Jason Wang', 'xi_an_famous_foods_t3rrou'), --3
('Dessert Person', 'Claire Saffitz', 'dessert_person_b3nikr'), --4
('Nothing Fancy', 'Alison Roman', 'nothing_fancy_zhrstd'), --5
('That Sounds So Good', 'Carla Lalli Music', 'that_sounds_so_good_m17afz'); --6

INSERT INTO
recipes (title, book_id, page_number, ingredients, rating, image_id)
VALUES
('Emilio''s Pomodoro', 1, 117, ARRAY ['dried spaghetti', 'extra-virgin olive oil', 'garlic cloves', 'cherry tomatoes', 'kosher salt', 'fresh basil', 'freshly grated Parmigiano-Reggiano', 'flaky sea salt'], 5, null),
('Brussels Sprouts with Shrimp Sauce', 3, 76, ARRAY ['vegetable oil', 'garlic cloves', 'Brussels sprouts', 'salt', 'dried shrimp', 'chicken bouillon powder'], 3, null),
('Honey Tahini Challah', 4, 295, ARRAY ['active dry yeast', 'honey', 'tahini', 'large egg yolks', 'extra-virgin olive oil', 'large eggs', 'bread flour', 'Diamond Crystal kosher salt', 'sesame seeds'], 4, null),
('Gingery Ground Beef with Lime and Herbs', 6, 60, ARRAY ['cooked rice', 'ginger', 'garlic cloves', 'shallot', 'limes', 'soy sauce', 'sriracha', 'fish sauce', 'vegetable oil', '80% lean ground beef', 'kosher salt', 'cilantro'], 5, null),
('Big Shells with Escarole, ''Chovies & Mozz', 2, 156, ARRAY ['escarole or radicchio or kale', 'garlic cloves', 'oregano or thyme leaves', 'fresh whole-milk mozzarella', 'heavy cream', 'Parmesan cheese', 'kosher salt', 'extra-virgin olive oil', 'panko bread crumbs', 'oil-packed anchovy fillets', 'red pepper flakes', 'dried large pasta shells'], 2, null),
('Garlicky Broccoli and Greens with Hazelnut and Coriander', 5, 160, ARRAY ['garlic cloves', 'toasted hazelnuts', 'coriander seeds', 'olive oil', 'kosher salt', 'broccoli', 'lacinato kale', 'lemon', 'flaky sea salt'], 3, null);






