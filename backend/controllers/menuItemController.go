package controllers

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/google/jsonapi"
	"gorm.io/gorm/clause"
)

type MenuItemController struct {
}

func (controller *MenuItemController) IndexFromRestaurant(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	results := services.Filter(database, &models.MenuItem{}, map[string]interface{}{
		"restaurant_id": restaurant.ID,
		"name":          r.URL.Query().Get("filter['name']"),
		"price":         r.URL.Query().Get("filter['price']"),
	})

	responses.OkResponse(w, results)
}

func (controller *MenuItemController) IndexFromMenu(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menu := r.Context().Value("menu").(models.Menu)

	database := services.GetConnection()

	menuItems := menu.MenuItems

	for i := range menuItems {
		database.Preload(clause.Associations).First(&menuItems[i], menuItems[i].ID)
	}

	responses.OkResponse(w, menuItems)
}

func (controller *MenuItemController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	var body validators.StoreMenuItemDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, []error{err})
		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, []error{err})
		return
	}

	menuItem := models.MenuItem{}

	menuItem.Fill(map[string]string{
		"name":  body.Data.Attributes.Name,
		"type":  body.Data.Attributes.Type,
		"price": strconv.FormatFloat(body.Data.Attributes.Price, 'f', -1, 64),
	})

	menuItem.SetRestaurant(&restaurant)

	result := database.Create(&menuItem)

	if result.Error != nil {
		responses.UnprocessableEntityResponse(w, []error{result.Error})

		return
	}

	database.Preload(clause.Associations).First(&menuItem, menuItem.ID)

	responses.CreatedResponse(w, &menuItem)
}

func (controller *MenuItemController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateMenuItemDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, []error{err})
		return
	}

	menuItem := r.Context().Value("menu-item").(models.MenuItem)

	menuItem.Fill(map[string]string{
		"name":  body.Data.Attributes.Name,
		"type":  body.Data.Attributes.Type,
		"price": strconv.FormatFloat(body.Data.Attributes.Price, 'f', -1, 64),
	})

	result := database.Save(&menuItem)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())
		return
	}

	responses.OkResponse(w, &menuItem)
}
