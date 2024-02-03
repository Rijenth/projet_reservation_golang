package controllers

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/google/jsonapi"
)

type MenuController struct {
}

func (controller *MenuController) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menu := r.Context().Value("menu").(models.Menu)

	responses.OkResponse(w, &menu)
}

func (controller *MenuController) IndexFromCommand(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	command := r.Context().Value("command").(models.Command)

	preloadRelations := []string{"Command", "MenuItems", "Restaurant"}

	database := services.GetConnection()

	results := services.Filter(database, &models.Menu{}, map[string]interface{}{
		"command_id": command.ID,
		"name":       r.URL.Query().Get("filter['name']"),
		"price":      r.URL.Query().Get("filter['price']"),
	}, preloadRelations)

	responses.OkResponse(w, results)
}

func (controller *MenuController) Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	preloadRelations := []string{"Restaurant", "Command", "MenuItems"}

	database := services.GetConnection()

	results := services.Filter(database, &models.Menu{}, map[string]interface{}{
		"restaurant_id": restaurant.ID,
		"name":          r.URL.Query().Get("filter['name']"),
		"price":         r.URL.Query().Get("filter['price']"),
	}, preloadRelations)

	responses.OkResponse(w, results)
}

func (controller *MenuController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	var body validators.StoreMenusDataValidator

	if err := body.Validate(&r.Body, &w); err != nil {
		return
	}

	var menuItemIDs []string

	for _, menuItem := range body.Data.Relationships.MenuItems {
		menuItemIDs = append(menuItemIDs, menuItem.ID)
	}

	var menuItems []*models.MenuItem
	var totalAmount float64 = 0.0

	if len(menuItemIDs) > 0 {
		result := database.Where(menuItemIDs).Find(&menuItems)

		if result.Error != nil {
			responses.InternalServerErrorResponse(w, result.Error.Error())
		}

		for _, menuItem := range menuItems {
			totalAmount += menuItem.Price
		}
	}

	if body.Data.Attributes.Price != 0 {
		totalAmount = body.Data.Attributes.Price
	}

	menu := models.Menu{}

	menu.Fill(map[string]string{
		"name":  body.Data.Attributes.Name,
		"price": fmt.Sprintf("%f", totalAmount),
	})

	menu.SetRestaurant(&restaurant)

	menu.SetMenuItems(menuItems)

	result := database.Create(&menu)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &menu)
}

func (controller *MenuController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateMenusDataValidator

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

	menu := r.Context().Value("menu").(models.Menu)

	menu.Fill(map[string]string{
		"name":  body.Data.Attributes.Name,
		"price": fmt.Sprintf("%f", body.Data.Attributes.Price),
	})

	result := database.Save(&menu)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &menu)
}

func (controller *MenuController) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menu := r.Context().Value("menu").(models.Menu)

	database := services.GetConnection()

	database.Delete(&menu)

	w.WriteHeader(http.StatusNoContent)
}
