package validators

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"fmt"
	"io"
	"net/http"
)

type StoreCommandDataValidator struct {
	Data struct {
		Type       string `validate:"required,eq=commands"`
		Attributes struct {
			Description string `validate:"required,min=3,max=255"`
		} `json:"attributes"`
		Relationships struct {
			Menus []struct {
				Type string `validate:"required,eq=menus"`
				ID   string `validate:"required"`
			} `validate:"required"`
		} `json:"relationships"`
	} `json:"data"`
}

func (storeCommandDataValidator *StoreCommandDataValidator) Validate(body *io.ReadCloser, w *http.ResponseWriter) error {
	var validated StoreCommandDataValidator

	var database = services.GetConnection()

	err := ValidateBody(&validated, body, w)

	if err != nil {
		return err
	}

	err = ValidateStruct(&validated, body, w)

	if err != nil {
		responses.FailedValidationResponse(*w, []error{err})

		return err
	}

	*storeCommandDataValidator = validated

	var relationshipErrors []error

	for index, menu := range storeCommandDataValidator.Data.Relationships.Menus {
		if menu.Type != "menus" {
			relationshipErrors = append(relationshipErrors, fmt.Errorf("Field type of the menu at index %d is invalid", index))
		}

		var menuFromDatabase models.Menu

		result := database.First(&menuFromDatabase, menu.ID)

		if result.Error != nil {
			relationshipErrors = append(relationshipErrors, fmt.Errorf("Field id of the menu at index %d doesn't exist", index))
		}
	}

	if len(relationshipErrors) > 0 {

		responses.UnprocessableEntityResponse(*w, relationshipErrors)

		return relationshipErrors[0]
	}

	return nil
}
