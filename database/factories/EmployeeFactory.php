<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'uuid' => $this->faker->unique()->uuid(),
            'matricula' => $this->faker->unique()->randomNumber(5, true),
            'nombre' => $this->faker->name(),
            'apellido_p' => $this->faker->lastName(),
            'apellido_m' => $this->faker->optional()->lastName(),

            'fecha_nac' => $this->faker->date(),
            'antiguedad' => $this->faker->date(),
            'sexo' => $this->faker->randomElement(['h', 'm', 'o']),

            'category_id' => $this->faker->randomElement([1, 2]),
            'unit_id' => $this->faker->randomElement([1, 2, 3]),
        ];
    }
}
