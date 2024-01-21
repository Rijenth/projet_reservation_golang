package users

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)

func GetUsersController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var users []*models.User

	database.Model(&models.User{}).Find(&users)

	responses.OkResponse(w, users)
}
