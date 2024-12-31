<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
   {
        Schema::table('preferences', function (Blueprint $table) {
             $table->text('pref_value')->after('keywords')->nullable();
              $table->text('pref_key')->after('keywords')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('preferences', function (Blueprint $table) {
            $table->dropColumn(['pref_key','pref_value']);
        });
    }
};
