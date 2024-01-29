export class ApiFetch {
  constructor(target, query) {
    this.baseUrl = "https://www.themealdb.com/api/json/v1/1/";

    switch (target) {
      case "searchByName":
        this.endpoint = "search.php?s=" + query;
        break;
      case "searchByFirstLetter":
        this.endpoint = "search.php?f=" + query;
        break;
      case "categories":
        this.endpoint = "categories.php";
        break;
      case "category":
        this.endpoint = "filter.php?c=" + query;
        break;
      case "areas":
        this.endpoint = "list.php?a=list";
        break;
      case "area":
        this.endpoint = "filter.php?a=" + query;
        break;
      case "ingredients":
        this.endpoint = "list.php?i=list";
        break;
      case "ingredient":
        this.endpoint = "filter.php?i=" + query;
        break;
      case "mealDetails":
        this.endpoint = "lookup.php?i=" + query;
        break;
      default:
        break;
    }
  }

  async fetchData() {
    const response = await fetch(this.baseUrl + this.endpoint || "")
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return response;
  }
}
