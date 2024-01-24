package menus

import (
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)

func DeleteMenusController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menus := r.Context().Value("menus").(models.Menus)

	database := services.GetConnection()

	database.Delete(&menus)

	w.WriteHeader(http.StatusNoContent)
}