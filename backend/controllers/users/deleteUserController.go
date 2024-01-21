package users

import (
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)

func DeleteUserController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	// Je récupère le user depuis le context (voir backend/contexts/userContext.go)
	user := r.Context().Value("user").(models.User)

	database := services.GetConnection()

	database.Delete(&user)

	w.WriteHeader(http.StatusNoContent)
}
