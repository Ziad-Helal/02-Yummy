export class Meal {
  constructor({
    idMeal,
    strMeal,
    strCategory,
    strArea,
    strInstructions,
    strMealThumb,
    strTags,
    strYoutube,
    strIngredient1,
    strIngredient2,
    strIngredient3,
    strIngredient4,
    strIngredient5,
    strIngredient6,
    strIngredient7,
    strIngredient8,
    strIngredient9,
    strIngredient10,
    strIngredient11,
    strIngredient12,
    strIngredient13,
    strIngredient14,
    strIngredient15,
    strIngredient16,
    strIngredient17,
    strIngredient18,
    strIngredient19,
    strIngredient20,
    strMeasure1,
    strMeasure2,
    strMeasure3,
    strMeasure4,
    strMeasure5,
    strMeasure6,
    strMeasure7,
    strMeasure8,
    strMeasure9,
    strMeasure10,
    strMeasure11,
    strMeasure12,
    strMeasure13,
    strMeasure14,
    strMeasure15,
    strMeasure16,
    strMeasure17,
    strMeasure18,
    strMeasure19,
    strMeasure20,
    strSource,
  }) {
    this.id = idMeal;
    this.name = strMeal;
    this.category = strCategory;
    this.area = strArea;
    this.instructions = strInstructions;
    this.thumbSrc = strMealThumb;
    this.tags = strTags;
    this.youtube = strYoutube;
    this.source = strSource;
    this.ingredients = [
      { ingredient: strIngredient1, measure: strMeasure1 },
      { ingredient: strIngredient2, measure: strMeasure2 },
      { ingredient: strIngredient3, measure: strMeasure3 },
      { ingredient: strIngredient4, measure: strMeasure4 },
      { ingredient: strIngredient5, measure: strMeasure5 },
      { ingredient: strIngredient6, measure: strMeasure6 },
      { ingredient: strIngredient7, measure: strMeasure7 },
      { ingredient: strIngredient8, measure: strMeasure8 },
      { ingredient: strIngredient9, measure: strMeasure9 },
      { ingredient: strIngredient10, measure: strMeasure10 },
      { ingredient: strIngredient11, measure: strMeasure11 },
      { ingredient: strIngredient12, measure: strMeasure12 },
      { ingredient: strIngredient13, measure: strMeasure13 },
      { ingredient: strIngredient14, measure: strMeasure14 },
      { ingredient: strIngredient15, measure: strMeasure15 },
      { ingredient: strIngredient16, measure: strMeasure16 },
      { ingredient: strIngredient17, measure: strMeasure17 },
      { ingredient: strIngredient18, measure: strMeasure18 },
      { ingredient: strIngredient19, measure: strMeasure19 },
      { ingredient: strIngredient20, measure: strMeasure20 },
    ];
  }
}

export class Category {
  constructor({
    idCategory,
    strCategory,
    strCategoryDescription,
    strCategoryThumb,
  }) {
    this.id = idCategory;
    this.name = strCategory;
    this.description = strCategoryDescription;
    this.thumbSrc = strCategoryThumb;
  }
}

export class Ingredient {
  constructor({ idIngredient, strDescription, strIngredient }) {
    this.id = idIngredient;
    this.name = strIngredient;
    this.description = strDescription;
    this.thumbSrc = `https://www.themealdb.com/images/ingredients/${this.name}.png`;
  }
}

export class Area {
  constructor({ strArea }) {
    this.name = strArea;
  }
}
