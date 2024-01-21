package users

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/google/jsonapi"
)

func UpdateUsersController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateUserDataValidator

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

	user := r.Context().Value("user").(models.User)

	if body.Data.Attributes.FirstName != "" {
		user.FirstName = body.Data.Attributes.FirstName
	} else {
		user.FirstName = ""
	}

	if body.Data.Attributes.LastName != "" {
		user.LastName = body.Data.Attributes.LastName
	} else {
		user.LastName = ""
	}

	if body.Data.Attributes.Username != "" {
		user.Username = body.Data.Attributes.Username
	}

	if body.Data.Attributes.Password != "" {
		user.Password = body.Data.Attributes.Password
	}

	result := database.Save(&user)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &user)
}
