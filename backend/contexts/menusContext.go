package contexts

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/jsonapi"
)

func MenusContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		menusID := chi.URLParam(r, "menusId")

		var menus models.Menus

		database := services.GetConnection()

		database.First(&menus, menusID)

		if menus.ID == 0 {
			w.Header().Set("Content-Type", jsonapi.MediaType)

			responses.NotFoundResponse(w, "Menus not found")

			return
		}

		database.Model(&menus).Association("Restaurant").Find(&menus.Restaurant)

		ctx := context.WithValue(r.Context(), "menus", menus)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}