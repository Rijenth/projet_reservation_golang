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
	"github.com/google/uuid"
)

type CommandController struct {
}

func (controller *CommandController) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	command := r.Context().Value("command").(models.Command)

	responses.OkResponse(w, &command)
}

func (controller *CommandController) Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	results := services.Filter(database, &models.Command{}, map[string]interface{}{
		"restaurant_id":         restaurant.ID,
		"identification_number": r.URL.Query().Get("filter['identificationNumber']"),
		"description":           r.URL.Query().Get("filter['description']"),
		"status":                r.URL.Query().Get("filter['status']"),
		"amount":                r.URL.Query().Get("filter['amount']"),
	})

	responses.OkResponse(w, results)
}

func (controller *CommandController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	var body validators.StoreCommandDataValidator

	if err := body.Validate(&r.Body, &w); err != nil {
		return
	}

	var menuIds []string

	for _, menu := range body.Data.Relationships.Menus {
		menuIds = append(menuIds, menu.ID)
	}

	var menusFromDatabase []*models.Menu
	var totalAmount float64 = 0.0

	if (len(menuIds)) != 0 {
		result := database.Find(&menusFromDatabase, menuIds)

		if result.Error != nil {
			responses.InternalServerErrorResponse(w, result.Error.Error())
		}

		for _, menu := range menusFromDatabase {
			totalAmount += menu.Price
		}
	}

	identificationNumber, _ := uuid.NewRandom()

	command := models.Command{}

	command.Fill(map[string]string{
		"identificationNumber": identificationNumber.String(),
		"description":          body.Data.Attributes.Description,
		"status":               "not_started",
		"amount":               strconv.FormatFloat(totalAmount, 'f', -1, 64),
	})

	command.SetRestaurant(&restaurant)

	command.SetMenus(menusFromDatabase)

	result := database.Create(&command)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &command)
}

func (controller *CommandController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateCommandDataValidator

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

	command := r.Context().Value("command").(models.Command)

	command.Fill(map[string]string{
		"description": body.Data.Attributes.Description,
		"status":      body.Data.Attributes.Status,
	})

	result := database.Save(&command)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &command)
}

func (controller *CommandController) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	command := r.Context().Value("command").(models.Command)

	database := services.GetConnection()

	database.Delete(&command)

	w.WriteHeader(http.StatusNoContent)
}
