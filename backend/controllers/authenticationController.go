package controllers

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/google/jsonapi"
)

type AuthenticationController struct {
}

func (controller *AuthenticationController) Login(w http.ResponseWriter, r *http.Request) {
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

	token, err := services.CreateToken(&user.Username)

	if err != nil {
		responses.InternalServerErrorResponse(w, "The authentication service is unavailable")

		return
	}

	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}

func (controller *AuthenticationController) CurrentUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	token := r.Header.Get("Authorization")

	if !strings.HasPrefix(token, "Bearer ") {
		responses.UnauthorizedResponse(w, "Invalid token")

		return
	}

	bearerToken := token[7:]

	err := services.VerifyToken(&bearerToken)

	if err != nil {
		responses.UnauthorizedResponse(w, "Invalid token")

		return
	}

	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(map[string]string{
		"message": "You are authenticated",
	})
}
