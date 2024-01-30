import { ApiFetch } from "../apis/apis.js";
import { Area, Category, Ingredient, Meal } from "../meals/meals.js";

export class HomePage {
  constructor() {
    this.#displayLoadingSpinner("main");
    this.#displayNavigationMenu();
    this.#init();
  }

  async #init() {
    const response = await new ApiFetch("searchByName", "").fetchData();
    this.meals = response.meals.map((meal) => new Meal({ ...meal }));
    this.#displayHomePage(this.meals);
  }

  #displayNavigationMenu() {
    const pageHeader = document.querySelector(".pageHeader");
    pageHeader.innerHTML = `
      <aside class="sidbar">
        <header class="asideHeader">
          <a href="/">
            <img src="./images/logo.png" alt="Yummy Logo" />
          </a>
          <button type="button" class="toggleSidebar">
            <i class="fa-solid fa-bars fa-2xl"></i>
          </button>
          <div class="links">
            <a href="/">
              <i class="fa-solid fa-globe"></i>
            </a>
            <a href="/">
              <i class="fa-solid fa-share-nodes"></i>
            </a>
          </div>
        </header>
        <div class="asideBody">
          <nav>
            <h2 class="sr-only">Main Navigation</h2>
            <ul>
              <li>
                <button type="button" data-page="search">Search</button>
              </li>
              <li>
                <button type="button" data-page="categories">Categories</button>
              </li>
              <li>
                <button type="button" data-page="area">Area</button>
              </li>
              <li>
                <button type="button" data-page="ingredients">Ingredients</button>
              </li>
              <li>
                <button type="button" data-page="contact">Contact Us</button>
              </li>
            </ul>
          </nav>
          <footer>
            <h2 class="sr-only">Our Links</h2>
            <ul>
              <li>
                <a href="/">
                  <i class="fa-brands fa-facebook"></i>
                </a>
              </li>
              <li>
                <a href="/">
                  <i class="fa-brands fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="/">
                  <i class="fa-solid fa-globe"></i>
                </a>
              </li>
            </ul>
            <p>Copyright Â© 2019 All Rights Reserved.</p>
          </footer>
        </div>
      </aside>
    `;

    let open = false;
    $(".pageHeader .toggleSidebar").on("click", function () {
      const icon = $(this).find("svg");
      icon.toggleClass("fa-bars");
      icon.toggleClass("fa-xmark");

      const sidebar = $(".sidbar");
      const asideBody = $(".sidbar .asideBody");
      if (open) {
        sidebar.animate({ left: "-16.1rem" }, 500);
        asideBody
          .find("nav button")
          .animate({ top: "10rem", opacity: "0" }, 500);
      } else {
        sidebar.animate({ left: "0" }, 500);
        asideBody.find("nav button").each(function (i) {
          setTimeout(() => {
            $(this).animate({ top: "0", opacity: "1" }, 700);
          }, 100 * i);
        });
      }

      open = !open;
    });

    const self = this;
    pageHeader.querySelectorAll("nav button").forEach((btn) => {
      btn.addEventListener("click", function () {
        const page = this.getAttribute("data-page");
        switch (page) {
          case "search":
            self.#displaySearchPage();
            break;
          case "categories":
            self.#displayCategoriesList();
            break;
          case "area":
            self.#displayAreasList();
            break;
          case "ingredients":
            self.#displayIngredientsList();
            break;
          case "contact":
            self.#displayContactForm();
            break;
          default:
            break;
        }

        const icon = $(".pageHeader .toggleSidebar svg");
        icon.toggleClass("fa-bars");
        icon.toggleClass("fa-xmark");
        open = !open;

        const sidebar = $(".sidbar");
        const asideBody = $(".sidbar .asideBody");
        sidebar.animate({ left: "-16.1rem" }, 500);
        asideBody
          .find("nav button")
          .animate({ top: "10rem", opacity: "0" }, 500);
      });
    });
  }

  #displayHomePage(meals) {
    document.querySelector("main").innerHTML = `<div class="list"></div>`;
    this.#displayMealsList(meals);
  }

  #displaySearchPage() {
    document.querySelector("main").innerHTML = `
      <section id="searchPage">
        <header>
          <input type="text" id="searchByName" placeholder="Search By Name" />
          <input
            type="text"
            id="searchByFirstLetter"
            placeholder="Search  By First Letter"
            maxlength="1"
          />
        </header>
        <div class="list"></div>
      </section>
    `;

    let nameTimeout = 0;
    document
      .querySelector("#searchByName")
      .addEventListener("input", (event) => {
        this.#displayLoadingSpinner(".list");
        clearTimeout(nameTimeout);
        nameTimeout = setTimeout(async () => {
          const meals = await new ApiFetch(
            "searchByName",
            event.target.value
          ).fetchData();
          this.#displayMealsList(
            meals.meals ? meals.meals.map((meal) => new Meal({ ...meal })) : []
          );
        }, 1000);
      });

    let letterTimeout = 0;
    document
      .querySelector("#searchByFirstLetter")
      .addEventListener("input", (event) => {
        clearTimeout(letterTimeout);
        letterTimeout = setTimeout(async () => {
          const meals = await new ApiFetch(
            "searchByFirstLetter",
            event.target.value[0]
          ).fetchData();
          this.#displayMealsList(
            meals.meals.map((meal) => new Meal({ ...meal })) || []
          );
        }, 1000);
      });

    this.#displayMealsList(this.meals);
  }

  #displayMealsList(meals) {
    document.querySelector(".list").innerHTML = `
      <h2 class="sr-only">Meals</h2>
      ${
        meals.length
          ? `<ul>
        ${meals
          .map(
            (meal) => `
          <li data-id=${meal.id}>
            <figure>
              <img
                src=${meal.thumbSrc}
                alt=${meal.name}
              />
              <figcaption>
                <h3>${meal.name}</h3>
              </figcaption>
            </figure>
          </li>
        `
          )
          .join("")}
      </ul>
      <div id="mealModal"></div>`
          : "<p class='empty'>No Meals Available!</p>"
      }
    `;

    const self = this;
    document.querySelectorAll(".list li").forEach((mealElement) =>
      mealElement.addEventListener("click", function () {
        self.#displayMealDetails(this.getAttribute("data-id"));
      })
    );
  }

  async #displayCategoriesList() {
    document.querySelector("main").innerHTML = `
      <h2 class="sr-only">Categories</h2>
      <div class="list"></div>
    `;

    this.#displayLoadingSpinner(".list");
    const response = await new ApiFetch("categories").fetchData();
    this.categories = response.categories.map(
      (cat) => new Category({ ...cat })
    );

    document.querySelector(".list").innerHTML = `
      <ul>
        ${this.categories
          .map(
            (cat) => `
          <li data-category=${cat.name}>
            <figure>
              <img
                src=${cat.thumbSrc}
                alt=${cat.name}
              />
              <figcaption>
                <h3>${cat.name}</h3>
                <P>${cat.description.slice(0, 100)}...</p>
              </figcaption>
            </figure>
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    const self = this;
    document.querySelectorAll(".list li").forEach((categoryElement) =>
      categoryElement.addEventListener("click", async function () {
        self.#displayLoadingSpinner("main");
        const response = await new ApiFetch(
          "category",
          this.getAttribute("data-category")
        ).fetchData();
        const meals = response.meals.map((meal) => new Meal({ ...meal }));
        self.#displayHomePage(meals);
      })
    );
  }

  async #displayAreasList() {
    document.querySelector("main").innerHTML = `
      <h2 class="sr-only">Ares</h2>
      <div class="noImagesList"></div>
    `;

    this.#displayLoadingSpinner(".noImagesList");
    const response = await new ApiFetch("areas").fetchData();
    this.areas = response.meals.map((area) => new Area({ ...area }));

    document.querySelector(".noImagesList").innerHTML = `
      <ul>
        ${this.areas
          .map(
            (area) => `
          <li data-area=${area.name}>
            <figure>
              <div class="svgWraper">
                <i class="fa-solid fa-house-laptop fa-10x"></i>
              </div>
              <figcaption>
                <h3>${area.name}</h3>
              </figcaption>
            </figure>
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    const self = this;
    document.querySelectorAll(".noImagesList li").forEach((areaElement) =>
      areaElement.addEventListener("click", async function () {
        self.#displayLoadingSpinner("main");
        const response = await new ApiFetch(
          "area",
          this.getAttribute("data-area")
        ).fetchData();
        const meals = response.meals.map((meal) => new Meal({ ...meal }));
        self.#displayHomePage(meals);
      })
    );
  }

  async #displayIngredientsList() {
    document.querySelector("main").innerHTML = `
      <h2 class="sr-only">Ingredients</h2>
      <div class="noImagesList"></div>
    `;

    this.#displayLoadingSpinner(".noImagesList");
    const response = await new ApiFetch("ingredients").fetchData();
    this.ingredients = response.meals.map(
      (ingredient) => new Ingredient({ ...ingredient })
    );

    document.querySelector(".noImagesList").innerHTML = `
      <ul>
        ${this.ingredients
          .slice(0, 20)
          .map(
            (ing) => `
          <li data-ing=${ing.name.split(" ").join("_")}>
            <figure>
              <div class="svgWraper">
                <i class="fa-solid fa-bowl-food fa-10x"></i>
              </div>
              <figcaption>
                <h3>${ing.name}</h3>
                ${
                  ing.description
                    ? `<P>${ing.description.slice(0, 70)}...</p>`
                    : ""
                }
              </figcaption>
            </figure>
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    const self = this;
    document.querySelectorAll(".noImagesList li").forEach((ingElement) =>
      ingElement.addEventListener("click", async function () {
        self.#displayLoadingSpinner("main");
        const response = await new ApiFetch(
          "ingredient",
          this.getAttribute("data-ing")
        ).fetchData();
        const meals = response.meals.map((meal) => new Meal({ ...meal }));
        self.#displayHomePage(meals);
      })
    );
  }

  #displayContactForm() {
    document.querySelector("main").innerHTML = `
      <div id="contact">
        <form autocomplete="off">
          <fieldset>
            <legend class="sr-only">Contact Us</legend>
            <div>
              <input type="text" id="nameInput" placeholder="Enter Your Name" />
            </div>
            <div>
              <input type="email" id="emailInput" placeholder="Enter Your Email" />
            </div>
            <div>
              <input
                type="number"
                id="phoneInput"
                placeholder="Enter Your Phone Number"
              />
            </div>
            <div>
              <input type="number" id="ageInput" placeholder="Enter Your Age" />
            </div>
            <div>
              <input
                type="password"
                id="passwordInput"
                placeholder="Enter Your Password"
              />
            </div>
            <div>
              <input
                type="password"
                id="confirmPasswordInput"
                placeholder="Reenter Your Password"
              />
            </div>
          </fieldset>
          <button type="submit" disabled>Submit</button>
        </form>
      </div>
    `;

    document.querySelector("#nameInput").addEventListener("input", (event) => {
      const inputFeedback = event.target.nextElementSibling;
      inputFeedback && inputFeedback.remove();
      this.#validateName(event.target.value);
      this.#submitValidity();
    });

    document.querySelector("#emailInput").addEventListener("input", (event) => {
      const inputFeedback = event.target.nextElementSibling;
      inputFeedback && inputFeedback.remove();
      this.#validateEmail(event.target.value);
      this.#submitValidity();
    });

    document.querySelector("#phoneInput").addEventListener("input", (event) => {
      const inputFeedback = event.target.nextElementSibling;
      inputFeedback && inputFeedback.remove();
      this.#validatePhone(event.target.value);
      this.#submitValidity();
    });

    document.querySelector("#ageInput").addEventListener("input", (event) => {
      const inputFeedback = event.target.nextElementSibling;
      inputFeedback && inputFeedback.remove();
      this.#validateAge(event.target.value);
      this.#submitValidity();
    });

    document
      .querySelector("#passwordInput")
      .addEventListener("input", (event) => {
        const inputFeedback = event.target.nextElementSibling;
        inputFeedback && inputFeedback.remove();
        this.#validatePassword(event.target.value);
        this.#submitValidity();
      });

    document
      .querySelector("#confirmPasswordInput")
      .addEventListener("input", (event) => {
        const inputFeedback = event.target.nextElementSibling;
        inputFeedback && inputFeedback.remove();
        this.#validatePasswordConfirm(event.target.value);
        this.#submitValidity();
      });
  }

  async #displayMealDetails(id) {
    document.body.style.overflow = "hidden";
    const modalSection = document.getElementById("mealModal");
    modalSection.style.position = "fixed";
    modalSection.innerHTML = `
      <div id="modalBackdrop"></div>
      <div id="mealDataModal" class="container"></div>
    `;
    this.#displayLoadingSpinner("#mealDataModal");

    const response = await new ApiFetch("mealDetails", id).fetchData();
    const meal = new Meal(response.meals[0]);

    document.getElementById("mealDataModal").innerHTML = `
      <button type="button" id="closeModalButton">
        <i class="fa-solid fa-xmark fa-2x"></i>
      </button>
      <div class="modalBody">
        <img src=${meal.thumbSrc} alt=${meal.name} />
        <div>
          <h3>${meal.name} <span class="sr-only">instructions</span></h3>
          <p>${meal.instructions}</p>
          <p><span>Area:</span> <span class="tag">${meal.area}</span></p>
          <p><span>Category:</span> <span class="tag">${
            meal.category
          }</span></p>
          ${
            meal.tags
              ? `<p><span>Tag:</span> <span class="tag">${meal.tags}</span></p>`
              : ""
          }
          <p><span>Recipes:</span></p>
          <ul class="recipes">
              ${meal.ingredients
                .map(({ ingredient, measure }) =>
                  !!ingredient
                    ? `<li class="tag">${measure} ${
                        measure.split(" ")[measure.split(" ").length - 1] ==
                        "chopped"
                          ? ""
                          : "of"
                      } ${ingredient}</li>`
                    : ""
                )
                .join("")}
          </ul>
          <div class="links">
            <a href=${meal.source} class="tag" target="_blank">Source</a>
            <a href=${meal.youtube} class="tag" target="_blank">Youtube</a>
          </div>
        </div>
      </div>
    `;

    modalSection
      .querySelector("#modalBackdrop")
      .addEventListener("click", () => {
        modalSection.innerHTML = "";
        document.body.style.overflow = "auto";
        modalSection.style.position = "static";
      });

    modalSection
      .querySelector("#closeModalButton")
      .addEventListener("click", () => {
        modalSection.innerHTML = "";
        document.body.style.overflow = "auto";
        modalSection.style.position = "static";
      });
  }

  #displayLoadingSpinner(selector) {
    document.querySelector(selector).innerHTML = `
      <div class="loadingSpinner">
        <i class="fa-solid fa-spinner fa-spin-pulse fa-3x"></i>
      </div>
    `;
  }

  #validateName(value) {
    const regex = new RegExp(/^[a-zA-Z]\w{2,14}$/);
    if (regex.test(value)) {
      const inputFeedback = document.querySelector(
        "#nameInput + .inputFeedback"
      );
      inputFeedback && inputFeedback.remove();
      this.isValidName = true;
    } else {
      document
        .querySelector("#nameInput")
        .insertAdjacentHTML(
          "afterend",
          `<p class="inputFeedback">Name should be between 3 and 15 charachters. You can use any uppercase or lowercase letters or any numbers or "_", but you should start with a character.</p>`
        );
      this.isValidName = false;
    }
  }

  #validateEmail(value) {
    const regex = new RegExp(/^[a-zA-Z]\w{2,14}@\w{1,5}\.\w{1,5}$/);
    if (regex.test(value)) {
      const inputFeedback = document.querySelector(
        "#emailInput + .inputFeedback"
      );
      inputFeedback && inputFeedback.remove();
      this.isValidEmail = true;
    } else {
      document
        .querySelector("#emailInput")
        .insertAdjacentHTML(
          "afterend",
          `<p class="inputFeedback">Ex.: name@example.com</p>`
        );
      this.isValidEmail = false;
    }
  }

  #validatePhone(value) {
    const regex = new RegExp(/^01[0125]\d{8}$/);
    if (regex.test(value)) {
      const inputFeedback = document.querySelector(
        "#phoneInput + .inputFeedback"
      );
      inputFeedback && inputFeedback.remove();
      this.isValidPhone = true;
    } else {
      document
        .querySelector("#phoneInput")
        .insertAdjacentHTML(
          "afterend",
          `<p class="inputFeedback">Enter a Valid Egyptian Phone Number!</p>`
        );
      this.isValidPhone = false;
    }
  }

  #validateAge(value) {
    if (+value > 0 && +value < 200) {
      const inputFeedback = document.querySelector(
        "#ageInput + .inputFeedback"
      );
      inputFeedback && inputFeedback.remove();
      this.isValidAge = true;
    } else {
      document
        .querySelector("#ageInput")
        .insertAdjacentHTML(
          "afterend",
          `<p class="inputFeedback">Enter a valid Age!</p>`
        );
      this.isValidAge = false;
    }
  }

  #validatePassword(value) {
    const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[\w \.]{8,30}$/);
    if (regex.test(value)) {
      const inputFeedback = document.querySelector(
        "#passwordInput + .inputFeedback"
      );
      inputFeedback && inputFeedback.remove();
      this.isValidPassword = true;
    } else {
      document
        .querySelector("#passwordInput")
        .insertAdjacentHTML(
          "afterend",
          `<p class="inputFeedback">Length should bew between 8 and 30 characters and should contain at least one number and one charachter.</p>`
        );
      this.isValidPassword = false;
    }
  }

  #validatePasswordConfirm(value) {
    const passwordValue = document.querySelector("#passwordInput").value;
    if (value == passwordValue) {
      const inputFeedback = document.querySelector(
        "#confirmPasswordInpu + .inputFeedback"
      );
      inputFeedback && inputFeedback.remove();
      this.isValidRePassword = true;
    } else {
      document
        .querySelector("#confirmPasswordInput")
        .insertAdjacentHTML(
          "afterend",
          `<p class="inputFeedback">Reenter the same Password!</p>`
        );
      this.isValidRePassword = false;
    }
  }

  #submitValidity() {
    if (
      this.isValidName &&
      this.isValidEmail &&
      this.isValidPhone &&
      this.isValidAge &&
      this.isValidPassword &&
      this.isValidRePassword
    ) {
      document.querySelector("form button[type='submit']").disabled = false;
    } else document.querySelector("form button[type='submit']").disabled = true;
  }
}
