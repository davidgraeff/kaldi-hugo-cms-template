#include <iostream>
#include <fstream>
#include <cstring>
#include <vector>
#include <algorithm>
#include <functional>
#include <future>
#include <chrono>
#include <random>
#include <string>
#include <set>
#include <experimental/filesystem>

constexpr unsigned time_res_per_ms = 3;

constexpr unsigned dtim_period_ticks = 300*time_res_per_ms;
constexpr unsigned beacon_time_ticks = 3*time_res_per_ms;
constexpr unsigned light_sleep_wakeup_time_ticks = 3*time_res_per_ms;
constexpr unsigned light_sleep_cooldown_time_ticks = 50*time_res_per_ms;
constexpr unsigned beacons = 5500/300;

constexpr unsigned sending_current_base = 145*1000;
constexpr unsigned receive_current_base = 60*1000;
constexpr unsigned modem_sleep_current_base = 20*1000;
constexpr unsigned light_sleep_current_base = 1200;


namespace {
std::default_random_engine generator;
std::uniform_int_distribution<unsigned> variation{0,4*1000};
std::normal_distribution<> m_variation{1000,800};
std::normal_distribution<> l_variation{500,200};
std::uniform_int_distribution<unsigned> variation_beacon{0,5};
std::uniform_int_distribution<unsigned> dist_sending{2,10};
std::uniform_int_distribution<unsigned> v_offset_beacon_ticks{time_res_per_ms*10,time_res_per_ms*50};
std::uniform_int_distribution<unsigned> receive_length_ticks{time_res_per_ms*10,time_res_per_ms*100};
std::uniform_int_distribution<unsigned> send_length_ticks{time_res_per_ms*1,time_res_per_ms*5};
std::normal_distribution<> variation_ls_cooldown{light_sleep_cooldown_time_ticks,10};

std::set<unsigned> receive_beacons{2,7};
}

using namespace std;

using Data = vector<tuple<unsigned,unsigned>>;
using Iter = Data::iterator;

template<bool with_light_sleep>
void gen_receiving(Data& d, unsigned& x_start, const unsigned rec_len, const unsigned send_len) {
    constexpr unsigned ti = with_light_sleep?1:0;

    unsigned send_pos =  rec_len/dist_sending(generator);
    for (unsigned j=0;j<send_pos;++j){
           std::get<ti>(d[x_start+j]) = receive_current_base + variation(generator);
    }

    x_start += send_pos;

    for (unsigned k=0;k<send_len;++k){
        std::get<ti>(d[x_start+k]) = sending_current_base + variation(generator);
    }

    x_start += send_len;

    for (unsigned j=0;j<rec_len-send_pos-send_len;++j){
            std::get<ti>(d[x_start+j]) = receive_current_base + variation(generator);
    }

    x_start += rec_len-send_pos-send_len;

    if (with_light_sleep) {
        const double cooldown = variation_ls_cooldown(generator);
        for (unsigned j=0;j<cooldown;++j)
            std::get<ti>(d[x_start+j]) = modem_sleep_current_base + variation(generator);

        x_start += light_sleep_cooldown_time_ticks;
    }
}

template<bool with_light_sleep>
void app(Data& d) {
    constexpr unsigned ti = with_light_sleep?1:0;
    cout << "start creating"<<endl;

    // Generate modem-sleep
    if (with_light_sleep)
        for (unsigned i=0;i<dtim_period_ticks*(beacons);++i){
            std::get<ti>(d[i]) = light_sleep_current_base + (unsigned)l_variation(generator);
        }
    else
        for (unsigned i=0;i<dtim_period_ticks*(beacons);++i){
            std::get<ti>(d[i]) = modem_sleep_current_base + (unsigned)m_variation(generator);
        }


    const unsigned offset_beacon_ticks = v_offset_beacon_ticks(generator);

    // Generate beacons
    unsigned x_start=0;
    for (unsigned i=0;i<beacons;++i){
        x_start = offset_beacon_ticks + variation_beacon(generator)+ i*dtim_period_ticks;

        if (with_light_sleep) {
            for (unsigned j=0;j<light_sleep_wakeup_time_ticks;++j)
                std::get<ti>(d[x_start+j]) = modem_sleep_current_base + variation(generator);

            x_start = x_start + light_sleep_wakeup_time_ticks;
        }

        for (unsigned j=0;j<beacon_time_ticks;++j)
            std::get<ti>(d[x_start+j]) = receive_current_base + variation(generator);

        x_start = x_start + beacon_time_ticks;
        if (receive_beacons.find (i)!=receive_beacons.end ()){
            const unsigned rec_len = receive_length_ticks(generator);
            const unsigned send_len = send_length_ticks(generator);
            gen_receiving<with_light_sleep>(d,x_start, rec_len, send_len);
        }
    }

    unsigned p = 4600*time_res_per_ms;
    gen_receiving<with_light_sleep>(d, p, 120, 30);
}

int main()
{
    std::string path ="/home/david/Programming/kompound-solutions-src/graph-generator/graph-generator/file.csv"; //std::experimental::filesystem::current_path();
    // Init
    fstream f( path,fstream::out|fstream::trunc);
    if (!f.is_open ()) return -1;
    cout << "Output to " << path<<endl;

    Data d; // µA
    d.resize (dtim_period_ticks*(beacons));

    f << "Time\tModem-Sleep\tLight-Sleep"<< endl;

    app<false>(d);
    app<true>(d);

    // Write data
    for (unsigned i=0;i<d.size ();++i)
        f << to_string (double(i)/time_res_per_ms) << "\t"<< to_string (double(get<0>(d[i]))/1000)<< "\t"<< to_string (double(get<1>(d[i]))/1000)<<"\n";

    f.close ();

    return 0;
}
