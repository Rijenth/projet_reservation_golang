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

func PlaceContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		placeID := chi.URLParam(r, "placeId")

		var place models.Place

		database := services.GetConnection()

		database.Preload("Restaurants").Preload("User").First(&place, placeID)

		if place.ID == 0 {
			w.Header().Set("Content-Type", jsonapi.MediaType)

			responses.NotFoundResponse(w, "Place not found")

			return
		}

		ctx := context.WithValue(r.Context(), "place", place)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
