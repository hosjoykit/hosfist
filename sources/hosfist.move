module main::hosfist {
    use std::signer;
    use std::error;
    use aptos_framework::event;

    //:!:>resource
    struct NumHolder has key {
        rm_num: u64,
        bet_type: u8,
    }
    //<:!:resource

    #[event]
    struct BetLog has drop, store {
        account: address,
        rm_num: u64,
        bet_type: u8,
        microseconds: u64
    }


    /// There is no message present
    const ENO_MESSAGE: u64 = 0;

    #[view]
    public fun get_rm_num(addr: address): u64 acquires NumHolder {
        assert!(exists<NumHolder>(addr), error::not_found(ENO_MESSAGE));
        borrow_global<NumHolder>(addr).rm_num
    }

    // bet function
    #[randomness]
    entry fun bet_handler(account: signer, bet_type: u8)   {
        let rm_numt = aptos_framework::randomness::u64_range(0, 36);
        let account_addr = signer::address_of(&account);

        // if (!exists<NumHolder>(account_addr)) {
        //     move_to(&account, NumHolder {
        //         rm_num : rm_numt,
        //         bet_type,
        //     })
        // } else {
        //     let old_message_holder = borrow_global_mut<NumHolder>(account_addr);
        //     old_message_holder.rm_num = rm_numt;
            
        // };

        event::emit(BetLog {
            account: account_addr,
            rm_num: rm_numt,
            bet_type,
            microseconds: aptos_framework::timestamp::now_microseconds(),
        });
        
    }

    // entry fun chonzhi(account: signer, )  {
    //     aptos_account::transfer(&account, @main, 100)
    // }

    //  entry fun tixian()acquires NumHolder   {
    //     let old_message_holder = borrow_global_mut<NumHolder>(@0x3e3c969220b693382c542ea1d6802f5176d62c58386f354bde473083878ded21);
    //     old_message_holder.rm_num = 20;
    // }


}