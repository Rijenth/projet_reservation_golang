package menus

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"net/http"

	"github.com/google/jsonapi"
	"github.com/go-playground/validator/v10"
)

func StoreMenusController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	user := r.Context().Value("user").(models.User)

	if user.Role != "owner" {
		responses.UnauthorizedResponse(w, "Only admin can create menus")

		return
	}

	database := services.GetConnection()

	var body validators.StoreMenusDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, err.Error())

		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, err)

		return
	}

	menus := models.Menus{
		Name: body.Data.Attributes.Name,
		Price: body.Data.Attributes.Price,
		User: &user,
		//MenuItems: []models.MenuItem{
		//	{
		}


	result := database.Create(&menus)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, menus)
}