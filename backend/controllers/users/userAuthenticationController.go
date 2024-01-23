package users

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
)

func UserAuthenticationController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	database := services.GetConnection()

	var body validators.LoginUserDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, err.Error())

		return
	}

	validate := validator.New()

	err = validate.Struct(body)

	if err != nil {
		responses.FailedValidationResponse(w, err)

		return
	}

	var user models.User

	if err := database.Where("username = ? AND password = ?", body.Username, body.Password).First(&user).Error; err != nil {
		responses.UnauthorizedResponse(w, "Invalid credentials")

		return
	}

	responses.OkResponse(w, &user)
}
