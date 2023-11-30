'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('Branches', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      car_rental_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'CarRentals',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      location: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      open_days: {
        type: Sequelize.JSON,
        allowNull: false
      },
      open_time: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      close_time: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('Reviews', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      rating: {
        type: Sequelize.DECIMAL(10, 1),
        allowNull: false
      },
      placed_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
         
      },
      car_rental_id: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'CarRentals',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      booking_id: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Bookings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    });

    await queryInterface.createTable('TermsVersions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      version: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    });

    // Bookings Table
    // Remove the "qrcode_state" column
    await queryInterface.removeColumn('Bookings', 'qrcode_state');
    await queryInterface.removeColumn('Bookings', 'new');
    await queryInterface.removeColumn('Bookings', 'new_company');

    // Rename the "booking_state" column to "booking_status"
    await queryInterface.removeColumn('Bookings','booking_state')
    await queryInterface.addColumn('Bookings', 'booking_status', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  
    // Add the "cancelation_party" column
    await queryInterface.addColumn('Bookings', 'cancelation_party', {
      type: Sequelize.STRING,
      allowNull: false, // Adjust allowNull as needed
    });

    // CarRentalReviews table
    // Add the columns that exist in the new model but not in the old one
    await queryInterface.addColumn('CarRentalReviews', 'placed_date', {
      type: Sequelize.DATE,
      allowNull: false, // Adjust allowNull as needed
    });

    // CarRentals table
     // Rename columns 
     await queryInterface.renameColumn('CarRentals','company_photo','company_logo');
     await queryInterface.renameColumn('CarRentals', 'delivery_charge','delivery_options');
     await queryInterface.renameColumn('CarRentals', 'documentation_url','api_docs_url');
     await queryInterface.removeColumn('CarRentals', 'opening_days');
     await queryInterface.removeColumn('CarRentals', 'opening_time');
     await queryInterface.removeColumn('CarRentals', 'closing_time');
     await queryInterface.removeColumn('CarRentals', 'location');
 
     // Remove columns that exist in the old model
     await queryInterface.removeColumn('CarRentals', 'new');
     await queryInterface.removeColumn('CarRentals', 'new_company');
     // Add columns that exist in the new model but not in the old one
  
     await queryInterface.addColumn('CarRentals', 'cars', {
       type: Sequelize.JSON,
       allowNull: true, // Adjust allowNull as needed
     });
     await queryInterface.addColumn('CarRentals', 'categories', {
       type: Sequelize.JSON,
       allowNull: true, // Adjust allowNull as needed
     });
     await queryInterface.addColumn('CarRentals', 'bookings', {
       type: Sequelize.JSON,
       allowNull: true, // Adjust allowNull as needed
     });
     await queryInterface.addColumn('CarRentals', 'active_cars', {
       type: Sequelize.JSON,
       allowNull: true, // Adjust allowNull as needed
     });
     await queryInterface.addColumn('CarRentals', 'joined_date', {
       type: Sequelize.DATE,
       allowNull: true, // Adjust allowNull as needed
     });
     await queryInterface.addColumn('CarRentals', 'branches', {
       type: Sequelize.JSON,
       allowNull: true, // Adjust allowNull as needed
     });
     await queryInterface.addColumn('CarRentals', 'reviews', {
       type: Sequelize.JSON,
       allowNull: true, // Adjust allowNull as needed
     });
     await queryInterface.addColumn('CarRentals', 'second_page_agreement', {
       type: Sequelize.STRING,
       allowNull: true, // Adjust allowNull as needed
     });
     await queryInterface.addColumn('CarRentals', 'live', {
       type: Sequelize.BOOLEAN,
       defaultValue:false,
       allowNull: false, // Adjust allowNull as needed
     });
     await queryInterface.addColumn('CarRentals', 'logged_in_date', {
      type: Sequelize.DATE,
      allowNull: true, // Adjust allowNull as needed
    });


     //SupportContacts table 
     await queryInterface.renameColumn('SupportContacts', 'solved', 'resolved');
     await queryInterface.removeColumn('SupportContacts', 'new');
     await queryInterface.removeColumn('SupportContacts', 'new_company');

     //User Reviews Table
     await queryInterface.addColumn('UserReviews', 'placed_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    
      // Cars table
    await queryInterface.removeColumn('Cars', 'rate_per_day');
    await queryInterface.removeColumn('Cars', 'deposit_fee');
    await queryInterface.removeColumn('Cars', 'deposit_currency');
    await queryInterface.removeColumn('Cars', 'verified1');
    await queryInterface.removeColumn('Cars', 'verified2');
    await queryInterface.removeColumn('Cars', 'new');
    await queryInterface.removeColumn('Cars', 'new_company');
    await queryInterface.removeColumn('Cars', 'published');
    await queryInterface.removeColumn('Cars', 'viewed');
    await queryInterface.removeColumn('Cars', 'viewedAdmin');

    // Categories Table
    await queryInterface.addColumn('CarCategories', 'available_cars', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn('CarCategories', 'added_percentage', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('CarCategories', 'booking_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn('CarCategories', 'categories_id');

    // Users Table

    await queryInterface.removeColumn('Users', 'rent_state')
    await queryInterface.removeColumn('Users', 'signature')
    await queryInterface.removeColumn('Users', 'passport_doc')
    await queryInterface.removeColumn('Users', 'id_doc')

    
    await queryInterface.addColumn('Users', 'logged_in_date', {
      type: Sequelize.DATE,
      allowNull: true, // Adjust allowNull as needed
    });

    await queryInterface.addColumn('Users', 'type', {
      type: Sequelize.INTEGER(1),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'version', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'middle_name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'rent_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'joined_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'bookings', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'license_issued_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'license_expiry_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'driving_license_photos', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'reviews', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false
    });


    // Droping Tables
    await queryInterface.dropTable('CategoryPhotos');
    await queryInterface.dropTable('Decreasing');
    await queryInterface.dropTable('Categories');
     await queryInterface.dropTable('CarReviews');
     await queryInterface.dropTable('Features');
     await queryInterface.dropTable('SeasonsCategories');
     await queryInterface.dropTable('Seasons');

    //  await queryInterface.dropTable('Rooms');
     await queryInterface.dropTable('UserReviews');
     await queryInterface.dropTable('CarRentalReviews');
     
    //  Rename the 'CarCategories' table to 'Categories'
    await queryInterface.renameTable('CarCategories', 'Categories');
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.dropTable('Branches')
    await queryInterface.dropTable('Reviews')
    await queryInterface.dropTable('TermsVersions')
     // Bookings Table
    // Remove the "cancelation_party" column
    await queryInterface.removeColumn('Bookings', 'cancelation_party');

    // "booking_status" column back to "booking_state"
    await queryInterface.removeColumn('Bookings','booking_status')
    await queryInterface.addColumn('Bookings', 'booking_state', {
      type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
    });


    await queryInterface.addColumn('Bookings', 'new', {
           type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });
    await queryInterface.addColumn('Bookings', 'new_company', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });
    // Add back the "qrcode_state"  columns
    await queryInterface.addColumn('Bookings', 'qrcode_state', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    
  
    //CarRentals table
   // Rename columns back to their original names
    await queryInterface.renameColumn('CarRentals','company_logo', 'company_photo');
    await queryInterface.renameColumn('CarRentals', 'delivery_options', 'delivery_charge');
    await queryInterface.renameColumn('CarRentals', 'api_docs_url', 'documentation_url');
    

   // Remove columns that were added in the up migration
    await queryInterface.removeColumn('CarRentals', 'cars');
    await queryInterface.removeColumn('CarRentals', 'categories');
    await queryInterface.removeColumn('CarRentals', 'bookings');
    await queryInterface.removeColumn('CarRentals', 'active_cars');
    await queryInterface.removeColumn('CarRentals', 'joined_date');
    await queryInterface.removeColumn('CarRentals', 'branches');
    await queryInterface.removeColumn('CarRentals', 'reviews');
    await queryInterface.removeColumn('CarRentals', 'second_page_agreement');
    await queryInterface.removeColumn('CarRentals', 'live');
    await queryInterface.removeColumn('CarRentals', 'logged_in_date');

    //Add back columns that were removed in the up migration

    await queryInterface.addColumn('CarRentals', 'opening_days',{
      type:Sequelize.STRING(50),
      allowNull:false
    });
    await queryInterface.addColumn('CarRentals', 'opening_time',{
      type:Sequelize.STRING(50),
      allowNull:false
    });
    await queryInterface.addColumn('CarRentals', 'closing_time',{
      type:Sequelize.STRING(50),
      allowNull:false
    });
    await queryInterface.addColumn('CarRentals', 'location',{
      type:Sequelize.JSON,
      allowNull:false
    });

    await queryInterface.addColumn('CarRentals', 'new', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Adjust defaultValue as needed
    });
    await queryInterface.addColumn('CarRentals', 'new_company', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Adjust defaultValue as needed
    });

    //Cars table
    const columnsToRevert = [
      'rate_per_day',
      'deposit_fee',
      'deposit_currency',
      'verified1',
      'verified2',
      'new',
      'new_company',
      'published',
      'viewed',
      'viewedAdmin',
    ];

    // Add back the columns that were removed
    for (const column of columnsToRevert) {
      await queryInterface.addColumn('Cars', column, Sequelize.STRING);
    }

 
         //Rename the 'Categories' table to 'CarCategories'
         await queryInterface.renameTable('Categories', 'CarCategories');
    // Categories Table
    await queryInterface.removeColumn('CarCategories', 'available_cars');
    await queryInterface.removeColumn('CarCategories', 'added_percentage');
    await queryInterface.removeColumn('CarCategories', 'booking_type');

    await queryInterface.createTable('Categories', {

      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });


    await queryInterface.addColumn('CarCategories', 'categories_id', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id',
      },
    });

        //SupportContacts table 
        await queryInterface.renameColumn('SupportContacts', 'resolved', 'solved');
 // Add back columns that were removed in the up migration
 await queryInterface.addColumn('SupportContacts', 'new', {
  type: Sequelize.BOOLEAN,
  allowNull: false,
  defaultValue: true, // Adjust defaultValue as needed
});
await queryInterface.addColumn('SupportContacts', 'new_company', {
  type: Sequelize.BOOLEAN,
  allowNull: false,
  defaultValue: true, // Adjust defaultValue as needed
});

    
     // Users table
    await queryInterface.removeColumn('Users', 'middle_name');
    await queryInterface.removeColumn('Users', 'password');
    await queryInterface.removeColumn('Users', 'rent_status');
    await queryInterface.removeColumn('Users', 'joined_date');
    await queryInterface.removeColumn('Users', 'bookings');
    await queryInterface.removeColumn('Users', 'license_issued_date');
    await queryInterface.removeColumn('Users', 'license_expiry_date');
    await queryInterface.removeColumn('Users', 'driving_license_photos');
    await queryInterface.removeColumn('Users', 'reviews');
    await queryInterface.removeColumn('Users', 'type');
    await queryInterface.removeColumn('Users', 'version');
    await queryInterface.removeColumn('Users', 'logged_in_date');

    await queryInterface.addColumn('Users', 'rent_state', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
    await queryInterface.addColumn('Users', 'signature',Sequelize.STRING(100))
    await queryInterface.addColumn('Users', 'passport_doc',Sequelize.STRING(400))
    await queryInterface.addColumn('Users', 'id_doc',Sequelize.STRING(400))

      //Create the 'CarReviews' table when rolling back the migration
      await queryInterface.createTable('CarReviews', {
        id: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
        description: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        rating: {
          type: Sequelize.DECIMAL(10, 1),
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        user_id: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        booking_id: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'Bookings',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        car_id: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'Cars',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
     
      });

        // Create the 'CategoryPhotos' table when rolling back the migration
    await queryInterface.createTable('CategoryPhotos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      // Define foreign key
      car_categories_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
      },
    });

        // Create the 'Decreasing' table when rolling back the migration
        await queryInterface.createTable('Decreasing', {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          day: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          rate: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          percent: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          old_rate: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          // Define foreign key
          car_categories_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              model: 'Categories',
              key: 'id',
            },
          },
        });
         // Create the 'Features' table when rolling back the migration
    await queryInterface.createTable('Features', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      feature: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      car_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

      // Create the 'Seasons' table when rolling back the migration
      await queryInterface.createTable('Seasons', {
        id: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        repeat_next_year: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        },
        car_rental_id: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'CarRentals',
            key: 'id'
          }
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });

      // Create the 'SeasonsCategories' table when rolling back the migration
    await queryInterface.createTable('SeasonsCategories', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      season_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Seasons',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      car_categories_id: {
        type: Sequelize.STRING,
        references: {
          model: 'CarCategories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      season_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      in_season: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    });
    // await queryInterface.createTable('Rooms', {
    //   id: {
    //     type: Sequelize.STRING,
    //     primaryKey: true,
    //     allowNull: false
    //   },
    //   createdAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false
    //   },
    //   updatedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false
    //   },
    //   // Add any other columns that were in the original definition
    //   car_rental_id: {
    //     type: Sequelize.STRING, // Assuming it's an integer in your CarRental model
    //     allowNull: false,
    //     references: {
    //       model: 'CarRentals',
    //       key: 'id'
    //     }
    //   },
    //   user_id: {
    //     type: Sequelize.STRING, 
    //     allowNull: false,
    //     references: {
    //       model: 'Users',
    //       key: 'id'
    //     }
    //   },
    //   booking_id: {
    //     type: Sequelize.STRING,  
    //     allowNull: false,
    //     references: {
    //       model: 'Bookings',
    //       key: 'id'
    //     }
    //   }
    // });
    await queryInterface.createTable('UserReviews', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      rating: {
        type: Sequelize.DECIMAL(10, 1),
        allowNull: false
      },
      placed_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // Add any other columns that were in the original definition
      user_id: {
        type: Sequelize.STRING, 
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      car_rental_id: {
        type: Sequelize.STRING,  
        allowNull: false,
        references: {
          model: 'CarRentals',
          key: 'id'
        }
      },
      booking_id: {
        type: Sequelize.STRING, 
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id'
        }
      }
    });
    await queryInterface.createTable('CarRentalReviews', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      description: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      rating: {
        type: Sequelize.DECIMAL(10, 1),
        allowNull: false
      },
      placed_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // Add any other columns that were in the original definition
      user_id: {
        type: Sequelize.STRING,  
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      car_rental_id: {
        type: Sequelize.STRING,  
        allowNull: false,
        references: {
          model: 'CarRentals',
          key: 'id'
        }
      },
      booking_id: {
        type: Sequelize.STRING, // Assuming it's an integer in your Booking model
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id'
        }
      }
    });

      // CarRentalReviews table
    // Remove the columns added in the "up" migration
    await queryInterface.removeColumn('CarRentalReviews', 'placed_date');
           //User Reviews Table
           await queryInterface.removeColumn('UserReviews', 'placed_date');
  }
};
