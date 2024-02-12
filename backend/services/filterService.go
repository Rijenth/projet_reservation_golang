package services

import (
	"fmt"
	"reflect"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func Filter(database *gorm.DB, model interface{}, filters map[string]interface{}) interface{} {
	modelType := reflect.TypeOf(model)
	sliceType := reflect.SliceOf(modelType)
	results := reflect.MakeSlice(sliceType, 0, 0).Interface()

	query := database

	for key, value := range filters {
		if value != "" {
			query = query.Where(fmt.Sprintf("%s = ?", key), value)
		}
	}

	query = query.Preload(clause.Associations)

	query.Find(&results)

	return results
}
