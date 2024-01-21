package users

import (
	"backend/models"
	"backend/responses"
	"net/http"

	"github.com/google/jsonapi"
)

func GetUsersController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	// Je récupère le user depuis le context (voir backend/contexts/userContext.go)
	user := r.Context().Value("user").(models.User)

	responses.OkResponse(w, &user)
}
